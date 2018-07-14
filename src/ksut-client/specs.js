export default {
    pub: {
        publish: (ns, channel, message) => [ns(channel), message],
    },
    sub: {
        subscribe: [
            (ns, channel, ...channels) => [ns(channel), ...channels.map(ns)], //arg mapper
            (gn, channel) => gn(channel), //result mapper
        ],
    },
    read: {
        get: ['set', (result, key) => [key, result]],
        hget: ['hset', (result, key, field) => [key, field, result]],
        hkeys: ['_hkeys', (result, key) => [key, result]],
    },
    write: {
        set: 0,
        hset: 0,
        _hkeys: 0,
    },
};