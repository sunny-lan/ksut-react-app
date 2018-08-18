import React from 'react';
import {connect} from 'react-redux';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';
import {Spinner} from 'office-ui-fabric-react/lib/Spinner';
import {Label} from "office-ui-fabric-react/lib/Label";
import {login} from '../actions';
import {Link} from 'office-ui-fabric-react/lib/Link';
import {NotificationManager} from 'react-notifications';
import deserializeError from 'deserialize-error';

const styles = {
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    loginBox: {
        display: 'flex',
        flexDirection: 'column',
        width: '400px',
        padding: '10px',
        marginBottom: '100px',
    },
    loginButton: {
        marginTop: '10px',
    }
};

async function register() {
    try {
        const response = await fetch('/createAccount', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: prompt('enter new username'),
                password: prompt('enter new password'),
            }),
        });
        if (response.status === 200)
            NotificationManager.success('Account created');
        else
            throw deserializeError((await response.json()).error);
    }catch(error) {
        NotificationManager.error(error.message, "Couldn't create account");
    }

}

function render(props) {
    function handleKeyPress(keyPressed) {
        if (keyPressed.key === 'Enter')
            props.onLogin();
    }

    return <div style={styles.main}>
        <div style={styles.loginBox}>
            <h1><Label>Login</Label></h1>
            <TextField
                label="Username"
                value={props.username}
                onChanged={newValue => props.onFieldChange('username', newValue)}
                disabled={props.loading}
                onKeyPress={handleKeyPress}
            />
            <TextField
                label="Password"
                value={props.password}
                onChanged={newValue => props.onFieldChange('password', newValue)}
                errorMessage={props.errorMessage}
                disabled={props.loading}
                type="password"
                onKeyPress={handleKeyPress}
            />
            {props.loading ?
                <Spinner style={styles.loginButton}/> :
                <DefaultButton
                    text='Login'
                    style={styles.loginButton}
                    onClick={props.onLogin}
                    primary={true}
                />
            }
            <Link onClick={register}>Register</Link>
        </div>
    </div>
}

function mapStateToProps(state) {
    return {
        ...state.login,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onFieldChange(field, newValue) {
            dispatch({type: 'LOGIN_FIELD_CHANGE', field, newValue});
        },
        onLogin() {
            dispatch(login())
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(render);