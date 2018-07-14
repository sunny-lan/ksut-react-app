import {get} from '../../util';

const commands = {
    set(state, key, value)
    {
        const rp = {...state};
        rp[key] = value;
        return rp;
    },

    hset(state, key, field, value) {
        return commands.set(state, key, commands.set(state[key], field, value));
    },

    _hkeys(state, key, fields){
        const rpH = {};
        fields.forEach(field => rpH[field] = get(state,'key','field') ? state[key][field] : null);
        return commands.set(state, key, rpH);
    }
};

/*const loadCommands = {
    set: (state, loading, key) => commands.set(state, key, loading),
    hset: (state, loading, key, field) => commands.set(state, key, field, loading)
};

function loadStateReducer(state = {}) {

}*/

export default function redisReducer(state = {}, action) {
    if (action.type !== 'REDIS')return state;
    if (action.error)return state;
    return commands[action.command](state, ...action.args);
}