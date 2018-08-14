const EventEmitter = require('events');

const {getName, getNamespace} = require('./namespace');
const {extract} = require('../util');

function wrapClient(client) {
    const channelEmitter = new EventEmitter(),
        namespaceEmitter = new EventEmitter();
    client.on('message', data => {
        channelEmitter.emit(data.channel, data.message);
        const namespace = getNamespace(data.channel);
        if (namespace)
            namespaceEmitter.emit(namespace, {
                ...data.message,
                name: getName(data.channel),
            });
    });
    return Object.assign(client,{
        channel: extract(channelEmitter),
        namespace: extract(namespaceEmitter),
    });
}

export default wrapClient;