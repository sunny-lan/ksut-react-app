import loginReducer from './login';
import redisReducer from './redis';
import {combineReducers} from "redux";

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

function rootReducer(state = {}, action) {
    state = {
        ...state,
        page: pageReducer(state.page, action),
        connection: connectionReducer(state.constructor, action),
    };
    if (state.page === 'HOME') state = {
        ...state,
        login: undefined,
    };
    else if (state.page === 'LOGIN') state = {
        ...state,
        login: loginReducer(state.login, action),
    };
    if (state.connection!==null)return {
        ...state,
        redis: redisReducer(state.redis, action),
    };
    else return {
        ...state,
        redis: undefined,
    }
}

export default combineReducers({
    login:loginReducer,
    redis:redisReducer,
    page:pageReducer,
    connection:connectionReducer,
});