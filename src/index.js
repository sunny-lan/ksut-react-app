import React from 'react';
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

import App from './App';
import configureStore from './store';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

initializeIcons();

const store = configureStore();
render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('root'));
registerServiceWorker();