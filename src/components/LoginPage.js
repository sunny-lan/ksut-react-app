import React from 'react';
import {connect} from 'react-redux';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';
import {Spinner} from 'office-ui-fabric-react/lib/Spinner';
import {Label} from "office-ui-fabric-react/lib/Label";
import {login} from '../actions';

const styles = {
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
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

function render(props) {
    return <div style={styles.main}>
        <div style={styles.loginBox}>
            <h1><Label>Login</Label></h1>
            <TextField
                label="Username"
                value={props.username}
                onChanged={newValue => props.onFieldChange('username', newValue)}
                disabled={props.isLoading}
            />
            <TextField
                label="Password"
                value={props.password}
                onChanged={newValue => props.onFieldChange('password', newValue)}
                errorMessage={props.errorMessage}
                disabled={props.isLoading}
                type="password"
                onKeyPress={keyPressed => {
                    if (keyPressed.key === 'Enter')
                        props.onLogin();
                }}
            />
            {props.isLoading ?
                <Spinner style={styles.loginButton}/> :
                <DefaultButton
                    text='Login'
                    style={styles.loginButton}
                    onClick={props.onLogin}
                    primary={true}
                />
            }
        </div>
    </div>
}

function mapStateToProps(state) {
    return state.login;
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