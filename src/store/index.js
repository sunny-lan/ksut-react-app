import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger'
//TODO remove logger in production
export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        composeWithDevTools(
            applyMiddleware(
                thunkMiddleware,
                logger
            )
        )
    );
}