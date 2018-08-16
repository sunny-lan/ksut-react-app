import connect from './ksut-client/websocketClient';
import specs from './ksut-client/specs';
import {namespace} from './ksut-client/namespace';
import {coalesce, get} from './util';
import wrapClient from './ksut-client/advancedClient';

export function wrapErrorHandler(callback, otherData) {
    return (dispatch, ...args) => {
        (async () => callback(dispatch, ...args))().catch(error => {
            dispatch({...otherData, error})
        });
    }
}

export function login(url) {
    return wrapErrorHandler(async (dispatch, getState) => {
        dispatch({type: 'LOGIN', begin: true});
        const state = getState();
        const connection = wrapClient(await connect(state.login.username, state.login.password, url));
        //TODO perform login retry on error
        connection.once('quit', error => dispatch({type: 'DISCONNECT', error}));
        connection.namespace.on('write', message => dispatch({type: 'REDIS', ...message}));
        dispatch({type: 'LOGIN', success: true, connection});
    }, {type: 'LOGIN'});
}

function redisify(cmdObj) {
    return {
        ...cmdObj,
        command: namespace('redis', cmdObj.command),
    };
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
    }, {type: 'REDIS'});
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
    }, {type: 'REDIS'});
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
    }, {type: 'REDIS'});
}

export function fetchAndSubscribe(cmdObj) {
    return wrapErrorHandler(async (dispatch) => {
        const commandInverse = specs.read[cmdObj.command][0],
            channel = namespace('write', cmdObj.args[specs.write[commandInverse]]);

        dispatch(fetchIntoStore(cmdObj));

        //subscribe
        dispatch(subscribe(channel));
    }, {type: 'REDIS'});
}

export function send(cmdObj, actionBase = {type: 'SEND'}) {
    return wrapErrorHandler(async (dispatch, getState) => {
        dispatch({...actionBase, begin: true,});
        const result = await getState().connection.send(cmdObj);
        dispatch({...actionBase, success: true, result});
    }, actionBase);
}

export function compile(scriptID) {
    return (dispatch, getState) => dispatch(send({
        command: 'script:compile',
        args: [scriptID, get(getState(), 'scripts', scriptID, 'code')],
    }, {type: 'SCRIPT_COMPILE', id: scriptID}));
}

export function fetchScript(scriptID) {
    return send({
        command: 'script:fetch',
        args: [scriptID]
    }, {type: 'SCRIPT_FETCH', id: scriptID});
}

export function fetchScriptInfo(scriptID) {
    return send({
        command: 'script:fetchInfo',
        args: [scriptID]
    }, {type: 'SCRIPT_FETCH_INFO', id: scriptID});
}