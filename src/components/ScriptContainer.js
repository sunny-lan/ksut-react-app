import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {get} from '../util';
import {fetchScript, fetchAndSubscribe, unsubscribe} from '../actions';
import {namespace} from '../ksut-client/namespace';

let styles = {
    common: {
        width: '100%',
        overflow: 'hidden',
        padding: '5px',
        boxSizing: 'border-box',
        display: 'flex',
    },
};
styles = {
    ...styles,
    compact: {
        ...styles.common,
        height: '40px',
        flexWrap: 'nowrap',
        borderBottom: 'solid 1px black',
    },
    medium: {
        ...styles.common,
        minHeight: '20vh',
        maxHeight: '33vh',
        flexDirection: 'column',
        borderBottom: 'solid 1px black',
    },
    maximized: {
        ...styles.common,
        height: '100%',
        flexDirection: 'column',
    },
    error: {
        color: 'red',
    },
};


const ScriptContainer = createReactClass({
    getInitialState(){
        return {}
    },

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({error: true});
    },

    componentDidMount(){
        this.props.onLoad();
        if (!this.props.scriptID)
            this.props.loadScriptID();
    },

    componentWillUnmount(){
        this.props.onUnload();
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.instanceID !== nextProps.instanceID)
            if (!nextProps.scriptID)
                nextProps.loadScriptID();

        if (nextProps.scriptID && this.props.scriptID !== nextProps.scriptID)
            nextProps.loadScript(nextProps.scriptID);
    },

    render()
    {
        if (this.state.error)
            return <div style={styles.error}>
                Plugin crashed
            </div>;

        const Component = this.props.component;
        let content;
        if (Component)
            content = <Component
                {...this.props.passedProps}
                instanceID={this.props.instanceID}
                size={this.props.size}
            />;
        return <div style={styles[this.props.size]}>
            <div>{this.props.id}</div>
            {content}
        </div>
    }
});

function mapStateToProps(state, ownProps) {
    let size;
    if (ownProps.maximized)
        size = 'maximized';
    else
        size = get(state, 'redis', 'instance-size', ownProps.instanceID) || 'medium';
    const scriptID = get(state, 'redis', 'instance-script', ownProps.instanceID);
    const component = get(state, 'scripts', scriptID, 'component');
    return {
        scriptID,
        component,
        size,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLoad(){
            dispatch(fetchAndSubscribe({
                command: 'hget',
                args: ['instance-size', ownProps.instanceID],
            }));
        },
        onUnload(){
            dispatch(unsubscribe(namespace('write', 'instance-size')));
            dispatch(unsubscribe(namespace('write', 'instance-script')));
        },
        loadScriptID(){
            dispatch(fetchAndSubscribe({
                command: 'hget',
                args: ['instance-script', ownProps.instanceID],
            }));
        },
        loadScript(scriptID){
            dispatch(fetchScript(scriptID));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptContainer);