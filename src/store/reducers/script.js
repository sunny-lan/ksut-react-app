import React from 'react';
import {connect} from 'react-redux';
import createReactClass from 'create-react-class';
import components from '../../pluginDependencies';

function singleReducer(state = {}, action) {
    switch (action.type) {
        case 'SCRIPT_EDIT'://also used for opening code
            return {
                ...state,
                code: action.newCode,
            };
        case 'SCRIPT_COMPILE':
            if (action.begin)
                return {
                    ...state,
                    loading: true,
                };
            else if (action.success)
                return {
                    ...state,
                    loading: false,
                };
            else if (action.error)
                return {
                    ...state,
                    errorMessage: action.error.message,
                    loading: false,
                };
            return state;
        default:
            return state;
    }
}

export default function scriptReducer(state = {}, action) {
    if(action.type==='REDIS'){
        //TODO refactor into separate SCRIPT_LOAD action
        if (action.command !== 'hset' || action.args[0] !== 'script-compiled')
            return state;
        const scriptID = action.args[1], code = action.args[2];
        const rp = {...state};
        rp[scriptID]={
            ...state[scriptID],
            compiled: createReactClass(eval(code)(React, components, scriptID, connect)),
        };
        return rp;
    }
    if (!action.id) return state;
    const rp = {...state};
    rp[action.id] = singleReducer(state[action.id], action);
    return rp;
}