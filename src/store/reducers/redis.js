import {get, coalesce, convertRedisRange} from '../../util';

const commands = {
    set(state, key, value)
    {
        const rp = {...state};
        rp[key] = value;
        return rp;
    },

    _hkeys(state, key, fields){
        const rpH = {};
        fields.forEach(field => rpH[field] = get(state, key, field) ? state[key][field] : null);
        return commands.set(state, key, rpH);
    },

    _hgetall(state, key, result){
        return commands.set(state, key, result);
    },

    hset(state, key, field, value) {
        return commands.set(state, key, commands.set(state[key], field, value));
    },

    hincrby(state, key, field, amt){
        return commands.hset(state, key, field, Number(coalesce(get(state, key, field), 0)) + Number(amt));
    },

    _lrange(state, key, start, stop, values){
        let newArray;
        if (Array.isArray(state[key])) {
            //TODO sketchy hack
            if(start===0 && stop===-1)
                newArray=values;
            else {
                stop = convertRedisRange(stop);
                newArray = state[key].slice(0, start).concat(values).concat(state[key].slice(stop));
            }
        } else {
            //TODO this has issues
            newArray = [];
            for (let i = 0; i < values.length; i++)
                newArray[i+start] = values[i];
        }
        return commands.set(state, key, newArray);
    },

    lpush(state, key, value, ...values){
        return commands.set(state, key, [value, ...values].concat(state[key]));
    },

    ltrim(state, key, start, stop){
        stop = convertRedisRange(stop);
        return commands.set(state, key, state[key].slice(start, stop));
    },
};

export default function redisReducer(state = {}, action) {
    if (action.type !== 'REDIS')return state;
    if (action.error)return state;
    return commands[action.command](state, ...action.args);
}