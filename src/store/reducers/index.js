import loginReducer from './login';

export default function (state = {
    page: 'LOGIN',
}, action) {
    if (state.page === 'LOGIN')
        state = {
            ...state,
            login: loginReducer(state.login, action),
            connection: action.connection,
        };
    switch (action.type) {
        case 'LOGIN':
            if (action.success)
                return {
                    ...state,
                    page: 'HOME'
                };
            else break;
        case 'DISCONNECT':
            return {
                ...state,
                page: 'LOGIN'
            };
    }
    return state;
}