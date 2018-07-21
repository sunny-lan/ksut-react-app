import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {Fabric} from 'office-ui-fabric-react/lib/Fabric';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import {withRouter} from 'react-router-dom';

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
        </Fabric>
    },
});

function mapStateToProps(state) {
    return {
        page: state.page,
    }
}

export default withRouter(connect(mapStateToProps)(App));
