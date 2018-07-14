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
                if (typeof action.error !== 'string')
                    action.error = action.error.message;
                return {
                    ...state,
                    errorMessage: action.error,
                    loading: false,
                };
            } else if (action.success)
                return {
                    ...state,
                    username: '',
                    password: '',
                    loading: false,
                };
            return state;
        case 'LOGIN_FIELD_CHANGE':
            const nextState = {...state};
            nextState[action.field] = action.newValue;
            return nextState;
        default:
            return state;
    }
}