import connect from '../ksut-client/connection';
import specs from '../ksut-client/specs';
import {namespace} from '../ksut-client/namespace';

export function login(url) {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({type: 'LOGIN', begin: true});
            const connection = await connect(state.login.username, state.login.password, url);
            dispatch({type: 'LOGIN', success: true, connection});
            connection.once('disconnect', (error) => dispatch({type: 'DISCONNECT', error}));
        } catch (error) {
            dispatch({type: 'LOGIN', error});
        }
    }
}

export function subscribeAndFetch(command) {
    return async (dispatch, getState) => {
        const connection=getState().connection;
        return Promise.all([
            (async () => {
                //run command
                const result = await connection.send(command);
                //find inverse of command, to set redisReducer
                const [commandInverse, argInverse] = specs.read[command];
                dispatch({
                    type: 'REDIS',
                    command: commandInverse,
                    args: argInverse(result, ...command.args)
                });
            })(),
            connection.send({
                command:'subscribe',
                args: ['write:']
            })
        ]);
    }
}