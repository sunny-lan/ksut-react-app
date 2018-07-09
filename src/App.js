import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Fabric} from 'office-ui-fabric-react/lib/Fabric';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import EditableLabel from './components/EditableLabel';

const styles = {
    app: {
        height: '100vh'
    }
};

class App extends Component {
    render() {
        let page;
        switch (this.props.page) {
            case 'LOGIN':
                page = <LoginPage/>;
                break;
            case 'HOME':
                page = <HomePage/>;
                break;
        }
        return <Fabric style={styles.app}>
            {page}
        </Fabric>
    }
}

function mapStateToProps(state) {
    return {
        page: state.page,
    }
}

export default connect(mapStateToProps)(App);
