const commands = {
    set(state, key, value)
    {
        const rp = {};
        rp[key] = value;
        return {...state, ...rp};
    },

    hset(state, key, field, value) {
        return commands.set(state, key, commands.set(state[key], field, value));
    },

    _keys(state, keys){
        const rp = {};
        keys.forEach(key => rp[key] = state[key]);
        return rp;
    }
};

const loadCommands = {
    set: (state, loading, key) => commands.set(state, key, loading),
    hset: (state, loading, key, field) => commands.set(state, key, field, loading)
};

function loadStateReducer(state={}){

}

export default function redisReducer(state = {
}, action) {
    if (action.type !== 'REDIS')return state;
    if(action.error)return state;
    return commands[action.command](state,...action.args);
}