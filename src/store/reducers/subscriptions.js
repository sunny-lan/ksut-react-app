import {coalesce} from '../../util';

export default function subscriptionsReducer(state = {}, action) {
    const rp = {};
    switch (action.type) {
        case 'SUBSCRIBE':
            rp[action.channel] = coalesce(state[action.channel], 0) + 1;
            return {
                ...state,
                ...rp,
            };
        case 'UNSUBSCRIBE':
            rp[action.channel] = coalesce(state[action.channel], 0) - 1;
            return {
                ...state,
                ...rp,
            };
        default:
            return state;
    }
}