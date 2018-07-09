export default function (state = {
    isLoading: false,
    username: '',
    password: '',
    errorMessage: ''
}, action) {
    switch (action.type) {
        case 'LOGIN':
            if (action.begin)
                return {
                    ...state,
                    isLoading: true,
                    errorMessage: '',
                };
            else if (action.error) {
                if (typeof action.error !== 'string')
                    action.error = action.error.message;
                return {
                    ...state,
                    errorMessage: action.error,
                    isLoading: false,
                };
            } else if (action.success)
                return {
                    ...state,
                    username: '',
                    password: '',
                    isLoading: false,
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