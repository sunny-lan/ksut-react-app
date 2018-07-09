// import specs from './specs';
import { timeout } from './config';

export default function createCommandWaiter(send) {
    //keep track of running commands (their resolve and reject functions)
    const openPromises = {};
    let counter = 0;
    return {
        recieve(response) {
            //when server responds, close the corresponding promise
            if (response.subType === 'result')
                openPromises[response.id].resolve(response.result);
            else if (response.subType === 'error')
                openPromises[response.id].reject(response.error);
            else
                console.error('Could not understand server message response');
        },

        send(command) {
            //give this command an id
            const thisID = '#' + counter;
            counter++;

            //actually send command
            send({
                type:'command',
                ...command,
                id: thisID
            });

            //wait for result as promise
            return new Promise((resolve, reject) => {
                //store promise in list of pendingText commands
                openPromises[thisID] = { resolve, reject };

                //cancel command if it hasn't been responded to for a long time
                setTimeout(() => {
                    delete openPromises[thisID];
                    reject('Command timed out');
                }, timeout);
            });
        }
    };
}

// export default function createWrapped(send) {
//     const waiter = createCommandWaiter(send);
//     const result = {
//         _recieve: waiter.recieve,
//         _send: waiter.send,
//     };
//     Object.keys(specs).forEach(namespace =>
//         specs[namespace].forEach(command => {
//             result[namespace] = {};
//             result[namespace][command] = (...args) => waiter.send({
//                 command, args
//             });
//         })
//     );
//     return result;
// }