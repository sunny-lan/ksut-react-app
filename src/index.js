import React from 'react';
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {initializeIcons} from 'office-ui-fabric-react/lib/Icons';

import App from './components/App';
import configureStore from './store';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

import {BrowserRouter} from 'react-router-dom';

initializeIcons();

const store = configureStore();
render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>, document.getElementById('root'));
registerServiceWorker();