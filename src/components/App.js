import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {Fabric} from 'office-ui-fabric-react/lib/Fabric';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import {withRouter} from 'react-router-dom';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const styles = {
    app: {
        height: '100vh'
    }
};

const App = createReactClass({
    componentWillMount(){
        document.title = 'ksut';
    },

    render() {
        let page;
        switch (this.props.page) {
            case 'LOGIN':
                page = <LoginPage/>;
                break;
            case 'HOME':
                page = <HomePage/>;
                break;
            default:
        }
        return <Fabric style={styles.app}>
            {page}
            <NotificationContainer/>
        </Fabric>
    },
});

function mapStateToProps(state) {
    return {
        page: state.page,
    }
}

export default withRouter(connect(mapStateToProps)(App));
