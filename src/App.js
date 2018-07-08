import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Fabric} from 'office-ui-fabric-react/lib/Fabric';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

const styles = {
    app: {
        height: '100vh'
    }
};

class App extends Component {
    render() {
        let Page;
        switch (this.props.page) {
            case 'LOGIN':
                Page = LoginPage;
                break;
            case 'HOME':
                Page = HomePage;
                break;
        }
        return (
            <Fabric style={styles.app}>
                <Page/>
            </Fabric>
        );
    }
}

function mapStateToProps(state) {
    return {
        page: state.page,
    }
}

export default connect(mapStateToProps)(App);
