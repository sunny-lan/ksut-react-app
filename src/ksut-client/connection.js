import EventEmitter from 'events';
import config from './config';
import wrap from './wrap';

function getNamespace(namespaced) {
    return namespaced.substring(0, namespaced.indexOf(':'));
}

function getName(namespaced) {
    return namespaced.substring(namespaced.indexOf(':') + 1);
}

export default async function connect(username, password, url = config.defaultServer) {
    const ws = new WebSocket(url);

    //websocket wrappers

    function open() {
        return new Promise(resolve => ws.onopen = resolve);
    }

    function on(callback, errorHandler) {
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'error')
                errorHandler(new Error(data.error));
            callback(data);
        };
    }

    function get() {
        return new Promise((resolve, reject) => {
            on(resolve, reject);
        });
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
    
    //wait for login result
    let response = await get();
    if (response.type !== 'loginSuccess')
        throw new Error('Unknown login error');

    //create command set
    const commands = wrap(send);

    //wait for server responses
    const emitter = new EventEmitter();
    on(data => {
        if (data.type === 'commandResponse') {
            commands._messageResponse(data);
        } else {
            emitter.emit(data.type, data);
            //also check for write
            if (data.type === 'message' && data.channel && getNamespace(data.channel) === 'write')
                emitter.emit('write', getName(data.channel), data.message);
        }
    }, error => emitter.emit('error', error));

    //TODO:set up heartbeat
    // ws.isAlive = true;
    // ws.on('pong', () => ws.isAlive = true);
    // const pingTimer = setInterval(() => {
    //     if (!ws.isAlive) return terminate();
    //     ws.isAlive = false;
    //     try {
    //         ws.ping();
    //     } catch (error) {
    //         terminate();
    //     }
    // }, config.timeout);

    // function terminate() {
    //     clearInterval(pingTimer);
    //     emitter.emit('disconnect');
    //     ws.onclose = function () {
    //     }; // disable onclose handler first
    //     ws.close();
    // }

    //add commands to result object
    return Object.assign(emitter, commands);
}