export default {
    redis: [
        'publish', 'subscribe',
        'get', 'set',
        'hset'
    ],
    user:[
        'setPassword',
        'getUsername',
        'del',
    ],
    script:[
        'compile'
    ]
};