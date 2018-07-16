import EventEmitter from 'events';
import config from './config';
import commandWaiter from './commandWaiter';

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
        return new Promise((resolve, reject) => {
            ws.onopen = resolve;
            ws.onclose = ws.onerror = () => reject(new Error('Websocket failure'));
        });
    }

    function on(callback, errorHandler) {
        ws.onclose = ws.onerror = () => errorHandler(new Error('Websocket failure'));
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

    //wait for loginReducer result
    let response = await get();
    if (response.type !== 'loginSuccess')
        throw new Error('Unknown loginReducer error');

    //create command set
    const commands = commandWaiter(send);

    //wait for server responses
    const emitter = new EventEmitter();
    on(data => {
        if (data.type === 'commandResponse') {
            commands.recieve(data);
        } else {
            emitter.emit(data.type, data);
            //also check for write
            if (data.type === 'message' && data.channel && getNamespace(data.channel) === 'write')
                emitter.emit('write', getName(data.channel), data.message);
        }
    }, error => emitter.emit('error', error));

    //set up heartbeat
    const pingTimer = setInterval(async () => {
        try {
            const response = await commands.send({
                command: 'good:vibrations',
                args: [false],
            });
            if (response !== '1.129848')
                terminate(new Error('tinkle tinkle hoy'));
        } catch (error) {
            terminate(error);
        }
    }, config.timeout);

    function terminate(error) {
        clearInterval(pingTimer);
        emitter.emit('disconnect', error);
        ws.close();
    }

    //add commands to result object
    emitter.send = commands.send;
    return emitter;
}