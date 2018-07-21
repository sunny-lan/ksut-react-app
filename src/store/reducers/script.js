import dependencies from '../../pluginDependencies';

const defaultCode=`//ksut: info begin
{
    "name":"your plugin name here"
}
//ksut: info end
//ksut: client code begin
//ksut: client code end`;

export default function code(state = {}, action) {
    const newScript = {...state[action.id]};
    switch (action.type) {
        case 'SCRIPT_FETCH':
            if (action.success) {
                //nothing changed
                if (newScript.compiled === action.result)
                    return state;
                newScript.compiled = action.result;
                newScript.component = eval(action.result)(dependencies);
            } else if (action.error) {
                //TODO add loading handling
            }
            break;
        case 'SCRIPT_FETCH_INFO':
            if (action.success) {
                newScript.info = action.result;
            } else if (action.error) {
                newScript.info.error = action.error;
            }
            break;
        case 'SCRIPT_NEW':
            newScript.code = defaultCode;
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

