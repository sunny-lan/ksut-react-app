import EventEmitter from 'events';
import config from './config';
import commandWaiter from './commandWaiter';
import deserializeError from 'deserialize-error';
import {getName, getNamespace} from './namespace';

export default async function connect(username, password, url = config.defaultServer) {
    const emitter = new EventEmitter();
    let lastError;

    //error handling stuff
    emitter.on('error', error => lastError = error);
    function createCancellable(action) {
        return new Promise((resolve, reject) => {
            if (lastError) reject(lastError);
            emitter.once('error', reject);
            action.then(resolve);
        });
    }

    emitter.once('error', terminate);

    const ws = new WebSocket(url);
    ws.onclose = ws.onerror = () => emitter.emit('error', new Error('Websocket failure'));

    //websocket wrappers
    function open() {
        return createCancellable(new Promise(resolve => ws.onopen = resolve));
    }

    function on(callback) {
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'error')
                emitter.emit('error', deserializeError(message.error));
            callback(message);
        };
    }

    function get() {
        return createCancellable(new Promise(resolve => on(resolve)));
    }

    function send(data) {
        ws.send(JSON.stringify(data));
    }

    await open();

    //wait for initial server message
    let initData = await get();
    if (initData.type !== 'init')
        throw new Error('Server did not ask to init');
    if (initData.version !== config.version)//verify version match
        throw new Error(`Server-client version are different. Server v${initData.version}, client v${config.version}`);

    //send credentials
    send({
        type: 'login',
        username, password
    });

    //wait for loginReducer result
    let response = await get();
    if (response.type !== 'loginSuccess')
        throw new Error('Unknown loginReducer error');

    //create command set
    const commands = commandWaiter(send, error => emitter.emit('error', error));

    //wait for server responses
    on(data => {
        if (data.type === 'commandResponse') {
            commands.recieve(data);
        } else {
            emitter.emit(data.type, data);
            //also check for write
            if (data.type === 'message' && data.channel && getNamespace(data.channel) === 'write')
                emitter.emit('write', getName(data.channel), data.message);
        }
    });

    //set up heartbeat
    const pingTimer = setInterval(async () => {
        try {
            const response = await commands.send({
                command: 'good:vibrations',
                args: [false],
            });
            if (response !== '1.129848')
                emitter.emit('error', new Error('tinkle tinkle hoy'));
        } catch (error) {
            emitter.emit('error', error);
        }
    }, config.timeout);

    function terminate(reason) {
        clearInterval(pingTimer);
        if (commands)
            commands.terminate(reason);
        ws.close();
    }

    //add commands to result object
    emitter.send = commands.send;
    emitter.terminate = terminate;
    return emitter;
}