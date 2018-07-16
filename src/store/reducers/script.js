import dependencies from '../../pluginDependencies';

export default function code(state = {}, action) {
    const newScript = {...state[action.id]};
    switch (action.type) {
        case 'SCRIPT_FETCH':
            if(action.success) {
                //nothing changed
                if (newScript.compiled === action.compiled)
                    return state;
                newScript.compiled = action.compiled;
                newScript.component = eval(action.compiled)(dependencies);
            }else if(action.error){
                //TODO add loading handling
            }
            break;
        case 'SCRIPT_EDIT':
            newScript.code = action.newCode;
            break;
        case 'SCRIPT_COMPILE':
            if (action.begin)
                newScript.loading = true;
            else if (action.success) {
                newScript.loading = false;
                newScript.errorMessage = undefined;
            } else if (action.error) {
                newScript.loading = false;
                newScript.errorMessage = action.error.message;
            }
            break;
        default:
            return state;
    }
    const newState = {...state};
    newState[action.id] = newScript;
    return newState;
}

