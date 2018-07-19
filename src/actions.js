import connect from './ksut-client/connection';
import specs from './ksut-client/specs';
import {namespace} from './ksut-client/namespace';
import {coalesce, get} from './util';

export function wrapErrorHandler(callback, type, otherData) {
    return (dispatch, ...args) => {
        (async () => callback(dispatch, ...args))().catch(error => {
            dispatch({type, ...otherData, error})
        });
    }
}

export function login(url) {
    return wrapErrorHandler(async (dispatch, getState) => {
        dispatch({type: 'LOGIN', begin: true});
        const state = getState();
        const connection = await connect(state.login.username, state.login.password, url);
        dispatch({type: 'LOGIN', success: true, connection});
        //TODO perform login retry on error
        connection.once('error', (error) => dispatch({type: 'DISCONNECT', error}));
        //TODO maybe should move to subscribe function
        connection.on('write', (key, command) => dispatch({type: 'REDIS', ...command}));
    }, 'LOGIN');
}

function redisify(cmdObj) {
    return {
        ...cmdObj,
        command: namespace('redis', cmdObj.command),
    };
}

export function write(cmdObj) {
    return wrapErrorHandler(async (dispatch, getState) => {
        await getState().connection.send(redisify(cmdObj));
    }, 'REDIS');
}

//fetches even if local version is already subscribed
export function fetchIntoStore(cmdObj) {
    return wrapErrorHandler(async (dispatch, getState) => {
        //run command
        const result = await getState().connection.send(redisify(cmdObj));
        //find inverse of command, to set redisReducer
        const [commandInverse, argInverse] = specs.read[cmdObj.command];
        dispatch({
            type: 'REDIS',
            command: commandInverse,
            args: argInverse(result, ...cmdObj.args)
        });
    }, 'REDIS');
}

function getSubCount(getState, channel) {
    return coalesce(get(getState(), 'subscriptions', channel), 0);
}

export function subscribe(channel) {
    return wrapErrorHandler(async (dispatch, getState) => {
        //only subscribe if only already subscribed
        if (getSubCount(getState, channel) === 0)
            channel = await getState().connection.send({
                command: namespace('redis', 'subscribe'),
                args: [channel]
            });

        dispatch({type: 'SUBSCRIBE', channel});
    }, 'REDIS');
}

export function unsubscribe(channel) {
    return wrapErrorHandler(async (dispatch, getState) => {
        dispatch({type: 'UNSUBSCRIBE', channel});

        //only unsubscribe if all subscribers are gone
        if (getSubCount(getState, channel) === 0)
            channel = await getState().connection.send({
                command: namespace('redis', 'unsubscribe'),
                args: [channel]
            });
    }, 'REDIS');
}

export function fetchAndSubscribe(cmdObj) {
    return wrapErrorHandler(async (dispatch) => {
        const commandInverse = specs.read[cmdObj.command][0],
            channel = namespace('write', cmdObj.args[specs.write[commandInverse]]);

        dispatch(fetchIntoStore(cmdObj));

        //subscribe
        dispatch(subscribe(channel));
    }, 'REDIS');
}

export function compile(scriptID) {
    return wrapErrorHandler(async (dispatch, getState) => {
        dispatch({type: 'SCRIPT_COMPILE', begin: true, scriptID});
        const state = getState();
        await state.connection.send({
            command: 'script:compile',
            args: [scriptID, get(state, 'scripts', scriptID, 'code')],
        });
        dispatch({type: 'SCRIPT_COMPILE', success: true, scriptID});
    }, 'SCRIPT_COMPILE', {scriptID});
}

export function fetchScript(scriptID) {
    return wrapErrorHandler(async (dispatch, getState) => {
        const result = await getState().connection.send({
            command: 'script:fetch',
            args: [scriptID]
        });
        dispatch({type: 'SCRIPT_FETCH', compiled: result, success: true, id:scriptID});
    }, 'SCRIPT_FETCH', {id:scriptID});
}