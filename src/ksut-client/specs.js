export default {
    pub: {
        publish: (ns, channel, message) => [ns(channel), message],
    },
    sub: {
        subscribe: [
            (ns, channel, ...channels) => [ns(channel), ...channels.map(ns)], //arg mapper
            (gn, channel) => gn(channel), //result mapper
        ],
        unsubscribe: [
            (ns, channel, ...channels) => [ns(channel), ...channels.map(ns)],
            (gn, channel) => gn(channel),
        ],
    },
    read: {
        get: ['set', (result, key) => [key, result]],
        hkeys: ['_hkeys', (result, key) => [key, result]],
        hget: ['hset', (result, key, field) => [key, field, result]],
        hgetall: ['_hgetall', (result, key) => [key, result]],
        lrange: ['_lrange', (result, key, start, stop) => [key, start, stop, result]]
    },
    write: {
        set: 0,
        _hkeys: 0,
        _hgetall: 0,
        hset: 0,
        hincrby: 0,
        _lrange: 0,
        lpush: 0,
        ltrim: 0,
    },
};