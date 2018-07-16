import {combineReducers} from 'redux';
import loginReducer from './login';
import redisReducer from './redis';
import scriptReducer from './script';
import subscriptionReducer from './subscriptions';

function pageReducer(state = 'LOGIN', action) {
    switch (action.type) {
        case 'LOGIN':
            if (action.success)
                return 'HOME';
            return state;
        case 'DISCONNECT':
            return 'LOGIN';
        default:
            return state;
    }
}

function connectionReducer(state = null, action) {
    switch (action.type) {
        case 'LOGIN':
            if (action.success)
                return action.connection;
            return state;
        case 'DISCONNECT':
            return null;
        default:
            return state;
    }
}

const lolReducer = combineReducers({
    login: loginReducer,
    page: pageReducer,
    connection: connectionReducer,
    redis: redisReducer,
    scripts: scriptReducer,
});


export default function subR(state = {}, action) {
    const {login, page, connection, redis, scripts} = state;
    state = lolReducer({login, page, connection, redis, scripts}, action);
    if (state.connection !== null)return {
        ...state,
        subscriptions: subscriptionReducer(state.subscriptions, action),
    };
    else return {
        ...state,
        subscriptions: undefined,
    };
}