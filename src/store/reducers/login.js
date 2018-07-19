export default function (state = {
    loading: false,
    username: 'admin',
    password: 'pass',
    errorMessage: ''
}, action) {
    switch (action.type) {
        case 'LOGIN':
            if (action.begin)
                return {
                    ...state,
                    loading: true,
                    errorMessage: '',
                };
            else if (action.error) {
                return {
                    ...state,
                    errorMessage: action.error.message,
                    loading: false,
                };
            } else if (action.success)
                return {
                    ...state,
                    loading: false,
                };
            return state;
        case 'LOGIN_FIELD_CHANGE':
            const nextState = {...state};
            nextState[action.field] = action.newValue;
            return nextState;
        case 'DISCONNECT':
            if (action.error)
                return {
                    ...state,
                    errorMessage: 'Disconnected. Reason: ' + action.error.message,
                };
            else
                return state;
        default:
            return state;
    }
}