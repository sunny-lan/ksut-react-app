import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {get} from '../util';
import {fetchScriptInfo, send} from '../actions';
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
    },
};

const ScriptContainer = createReactClass({
    componentDidMount(){
        if (!this.props.info)
            this.props.loadScriptInfo();
    },

    render(){
        return <div style={styles.main}>
            <strong>{this.props.name}</strong>
            <pre>{this.props.description || 'No description'}</pre>
            <DefaultButton text="Start instance" onClick={this.props.instantiateScript}/>
        </div>
    },
});

function mapStateToProps(state, ownProps) {
    return get(state, 'scripts', ownProps.scriptID, 'info') || {};
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        loadScriptInfo(){
            dispatch(fetchScriptInfo(ownProps.scriptID));
        },
        instantiateScript(){
            dispatch(send({
                command: 'script:instantiate',
                args: [ownProps.scriptID],
            }));
        },
    };
}

export  default connect(mapStateToProps, mapDispatchToProps)(ScriptContainer);