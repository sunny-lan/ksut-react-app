import React from 'react';
import {CommandBar} from 'office-ui-fabric-react/lib/CommandBar';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {get} from '../util';

const styles = {
    bar: {
        width: '100%',
    },
};

function Bar(props) {
    return <CommandBar
        style={styles.bar}
        items={[
            {key: 'home', iconProps: {iconName: 'Home'}, onClick: () => props.history.push('/')},
            {key: 'add', iconProps: {iconName: 'Add'}, onClick: () => props.history.push('/search')},
        ]}
        farItems={[
            {
                key: 'account',
                name: props.username,
                subMenuProps: {
                    items: [
                        {key: 'logout', name: 'Logout', onClick: props.logout},
                        {key: 'settings', name: 'Settings'},
                    ]
                },
            },
        ]}
    />
}

function mapStateToProps(state) {
    return {
        username: get(state, 'login', 'username'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout(){
            dispatch({type: 'DISCONNECT'});
        },
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bar));