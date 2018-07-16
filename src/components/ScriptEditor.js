import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';
import {Spinner} from 'office-ui-fabric-react/lib/Spinner';
import {get} from '../util';
import {namespace} from '../ksut-client/namespace';
import {compile, fetchAndSubscribe, unsubscribe} from '../actions';
import AceEditor from 'react-ace';
import brace from 'brace';

import 'brace/mode/javascript';
import 'brace/theme/solarized_light';

const styles = {
    main: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        width: '100%',
    },
    codeEditor: {
        width:'100%',
        flexGrow: '1',
    },
    compileButton: {
        marginTop: '0px',
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
            <AceEditor
                mode="javascript"
                theme="solarized_light"
                name="sdfkjh"
                onChange={this.props.onChanged}
                value={this.props.code}
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                disabled={this.props.loading}
                style={styles.codeEditor}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 4,
                }}
            />
            {this.props.diverged && <div>Unsaved changes (local & server version different)</div>}
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
    const props = get(state, 'scripts', ownProps.id) || {};
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