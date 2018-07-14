import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';
import {Spinner} from 'office-ui-fabric-react/lib/Spinner';
import {get} from '../util';
import {namespace} from '../ksut-client/namespace';
import {compile, fetchAndSubscribe, unsubscribe} from '../actions';

const styles = {
    main: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        width: '100%',
    },
    codeEditor: {
        flexGrow: '1',
        maxWidth: '100%',
    },
    compileButton: {
        marginTop: '10px',
    },
};

const ScriptEditor = createReactClass({
    componentDidMount(){
        this.props.onLoad();
    },

    componentWillUnmount(){
        this.props.onUnload();
    },

    render(){
        //TODO split loading button into separate file
        return <div style={styles.main}>
            {this.props.diverged && <div>Unsaved changes (local & server version different)</div>}
            <TextField
                style={styles.codeEditor}
                multiline
                autoAdjustHeight
                resizable={false}
                value={this.props.code}
                errorMessage={this.props.errorMessage}
                disabled={this.props.loading}
                onChanged={this.props.onChanged}
            />
            {this.props.loading ?
                <Spinner style={styles.compileButton}/> :
                <DefaultButton
                    style={styles.compileButton}
                    onClick={this.props.onSave}
                    text="Save & Compile"
                />
            }
        </div>
    },
});

function mapStateToProps(state, ownProps) {
    const props = get(state, 'loadedScripts', ownProps.id) || {};
    const serverCode = get(state, 'redis', 'script-code', ownProps.id);
    let diverged = false;
    if (props.code) {
        if (props.code !== serverCode)
            diverged = true;
    } else
        props.code = serverCode || '';
    return {...props, diverged};
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLoad(){
            dispatch(fetchAndSubscribe({
                command: 'hget',
                args: ['script-code', ownProps.id]
            }));
        },
        onChanged(newCode){
            dispatch({type: 'SCRIPT_EDIT', newCode, id: ownProps.id});
        },
        onSave(){
            dispatch(compile(ownProps.id));
        },
        onUnload(){
            dispatch(unsubscribe(namespace('write', 'script-code')));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptEditor);