import connect from './ksut-client/connection';
import specs from './ksut-client/specs';
import {namespace} from './ksut-client/namespace';

export function wrapErrorHandler(callback, type) {
    return (dispatch, ...args) => {
        (async () => callback(dispatch, ...args))().catch(error =>{dispatch({type, error})});
    }
}

export function login(url) {
    return wrapErrorHandler(async (dispatch, getState) => {
        const state = getState();
        dispatch({type: 'LOGIN', begin: true});
        const connection = await connect(state.login.username, state.login.password, url);
        dispatch({type: 'LOGIN', success: true, connection});
        connection.once('disconnect', (error) => dispatch({type: 'DISCONNECT', error}));
        connection.on('error', (error) => dispatch({type: 'CONNECTION_ERROR', error}));
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

export function fetchAndSubscribe(cmdObj) {
    return wrapErrorHandler(async (dispatch, getState) => {
        const commandInverse = specs.read[cmdObj.command][0];
        //fetch
        dispatch(fetchIntoStore(cmdObj));
        //subscribe
        await getState().connection.send({
            command: namespace('redis', 'subscribe'),
            args: [namespace('write', cmdObj.args[specs.write[commandInverse]])]
        });
    }, 'REDIS');
}