import React from 'react';
import createReactClass from 'create-react-class';
import components from '../../pluginDependencies';

export default function scriptReducer(state = {}, action) {
    if (action.type !== 'REDIS')return state;
    if (action.command !== 'hset' || action.args[0] !== 'script-compiled')
        return state;
    const rp = {};
    const scriptID = action.args[1], code = action.args[2];
    rp[scriptID] = createReactClass(eval(code)(React, components, scriptID));
    return {
        ...state,
        ...rp,
    };
}