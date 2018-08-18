import React from 'react';
import {CommandBar} from 'office-ui-fabric-react/lib/CommandBar';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {get} from '../util';
import {NotificationManager} from 'react-notifications';
import {isBrowser} from 'react-device-detect';

const styles = {
    bar: {
        width: '100%',
    },
};

function Bar(props) {
    let items = [
        {key: 'home', iconProps: {iconName: 'Home'}, path: '/'},
        {key: 'add', iconProps: {iconName: 'Add'}, path: '/search'},
    ];
    if (isBrowser)
        items.push({key: 'developer', iconProps: {iconName: 'DeveloperTools'}, path: '/developer'});
    items = items.map(item => {
        item.onClick = () => props.history.push(item.path);
        if (props.location.pathname === item.path)
            item.iconProps.style = {color: 'red'};
        return item;
    });

    async function handlePasswordChange() {
        try {
            await props.changePassword(prompt("enter a new password"));
            NotificationManager.success('Password changed');
        }catch(error){
            NotificationManager.error(error.message, 'Password change failed');
        }
    }

    return <CommandBar
        style={styles.bar}
        items={items}
        farItems={[{
            key: 'account',
            name: props.username,
            subMenuProps: {
                items: [
                    {key: 'logout', name: 'Logout', onClick: props.logout},
                    {
                        key: 'settings', name: 'Password',
                        onClick: handlePasswordChange,
                    },
                ]
            },
        }]}
    />
}

function mapStateToProps(state) {
    return {
        username: get(state, 'login', 'username'),
        async changePassword(newPassword){
            await state.connection.send({
                command: 'user:setPassword',
                args: [newPassword],
            });
        },

        logout(){
            //TODO remove the error
            state.connection.quit(new Error('Logged out'));
        },
    }
}

export default withRouter(connect(mapStateToProps)(Bar));