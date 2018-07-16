import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {get} from '../util';
import {fetch} from '../actions';

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
        const Component = this.props.component;
        if (Component)
            return <Component {...this.props.passedProps}/>;
        else return <div/>;
    }
});

function mapStateToProps(state, ownProps) {
    return {
        component: get(state, 'scripts', ownProps.id, 'component'),
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLoad(){
            dispatch(fetch(ownProps.id));
        },
        onUnload(){
            //do nothing
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptContainer);