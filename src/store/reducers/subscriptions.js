import {coalesce} from '../../util';

export default function subscriptionsReducer(state = {}, action) {
    const rp = {...state};
    switch (action.type) {
        case 'SUBSCRIBE':
            rp[action.channel] = coalesce(state[action.channel], 0) + 1;
            break;
        case 'UNSUBSCRIBE':
            rp[action.channel] = coalesce(state[action.channel], 0) - 1;
            break;
        default:
            return state;
    }
    return rp;
}