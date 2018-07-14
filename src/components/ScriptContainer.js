import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {get} from '../util';
import {fetchAndSubscribe, unsubscribe} from '../actions';
import {namespace} from '../ksut-client/namespace';

const ScriptContainer = createReactClass({
    componentDidMount(){
        this.props.onLoad();
    },

    componentWillUnmount(){
        this.props.onUnload();
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.id !== this.props.id) {
            nextProps.onLoad();
        }
    },

    render() {
        const Component = this.props.script;
        if (Component)
            return <Component {...this.props.passedProps}/>;
        else return <div/>;
    }
});

function mapStateToProps(state, ownProps) {
    return {
        script: get(state, 'loadedScripts', ownProps.id, 'compiled'),
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLoad(){
            dispatch(fetchAndSubscribe({
                command: 'hget',
                args: ['script-compiled', ownProps.id]
            }));
        },
        onUnload(){
            dispatch(unsubscribe(namespace('write', 'script-compiled')));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptContainer);