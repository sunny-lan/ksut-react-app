import connect from '../ksut-client/connection';

export function login(username, password, url) {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({type: 'LOGIN', begin: true});
            const connection = await connect(state.login.username, state.login.password, url);
            dispatch({type: 'LOGIN', success: true, connection});
            connection.once('disconnect', () => dispatch({type: 'DISCONNECT'}));
        } catch (error) {
            dispatch({type: 'LOGIN', error});
        }
    }
}