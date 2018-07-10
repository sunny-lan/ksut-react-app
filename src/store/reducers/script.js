import React from 'react';
import createReactClass from 'create-react-class';
import components from '../../pluginDependencies';

export default function scriptReducer(state = {}, action) {
    if (action.type !== 'REDIS')return state;
    if (action.command !== 'hset' || action.args[0] !== 'script-compiled')
        return state;
    const rp = {};
    rp[action.args[1]] = createReactClass(eval(action.args[2])(React, components));
    return {
        ...state,
        ...rp,
    };
}