import EventEmitter from 'events';
import config from './config';
import deserializeError from 'deserialize-error';
import createClient from './messageClient';
import {extract} from '../util';

export default async function connect(username, password, url = config.defaultServer) {
    const emitter = new EventEmitter();
    //error handling stuff
    const pError = new Promise((_, reject) => emitter.once('error', reject));

    function raceCancel(callback, ...args) {
        return Promise.race([pError, Promise.resolve()])
            .then(() => Promise.race([pError, callback(...args)]));
    }

    const ws = new WebSocket(url);
    ws.onclose = ws.onerror = () => emitter.emit('error', new Error('Websocket failure'));
    emitter.once('error', () => ws.onclose = ws.onerror = undefined);

    //websocket wrappers
    function open() {
        return new Promise(resolve => ws.onopen = resolve);
    }

    function on(callback) {
        ws.onmessage = (event) => {
            try {
                callback(JSON.parse(event.data));
            } catch (error) {
                emitter.emit('error', error);
            }
        };
    }

    function get() {
        return new Promise(resolve => on(data => {
            if (data.type === 'error')
                emitter.emit('error', deserializeError(data.error));
            resolve(data);
        }));
    }

    function send(data) {
        ws.send(JSON.stringify(data));
    }

    await raceCancel(open);

    //wait for initial server message
    let initData = await raceCancel(get);
    if (initData.type !== 'init')
        throw new Error('Server did not ask to init');
    if (initData.version !== config.version)//verify version match
        throw new Error(`Server-client version are different. Server v${initData.version}, client v${config.version}`);

    //send credentials
    send({
        type: 'login',
        username, password
    });

    //wait for login result
    let response = await raceCancel(get);
    if (response.type !== 'loginSuccess')
        throw new Error('Unknown loginReducer error');

    //create command set
    const client = createClient(send, true);
    emitter.once('error', client.quit);
    client.on('error', error => emitter.emit('error', error));
    client.on('message', (...args) => emitter.emit('message', ...args));

    //wait for server responses
    on(client.receive);

    return {
        ...extract(emitter),

        send: client.send,
        s: client.s,

        quit: client.quit,
    }
}