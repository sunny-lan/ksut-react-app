import specs from './specs';
import {timeout} from './config';

//merge all of specs into single object for ez processing
const allCommands = Object.keys(specs)
    .reduce((output, current) => output.concat(Object.keys(specs[current])),[]);

export default function createWrapped(send) {
    //keep track of running commands (their resolve and reject functions)
    const openPromises = {};
    const result = {
        _messageResponse(response) {
            //when server responds, close the corresponding promise
            if (response.subType === 'result')
                openPromises[response.id].resolve(response.result);
            else if (response.subType === 'error')
                openPromises[response.id].reject(response.error);
            else
                console.error('Could not understand server message response');
        }
    };

    let counter = 0;
    allCommands.forEach(command => {
        result[command] = (...args) => {
            //give this command an id
            const thisID = '#' + counter;
            counter++;

            //actually send command
            send({
                type: 'command',
                command, args,
                id: thisID
            });

            //wait for result as promise
            return new Promise((resolve, reject) => {
                //store promise in list of pending commands
                openPromises[thisID] = { resolve, reject };

                //cancel command if it hasn't been responded to for a long time
                setTimeout(() => {
                    delete openPromises[thisID];
                    reject('Command timed out');
                }, timeout);
            });
        };
    });
    return result;
}