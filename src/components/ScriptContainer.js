import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {get} from '../util';
import {fetch, fetchAndSubscribe, unsubscribe} from '../actions';

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
    error:{
        color:'red',
    },
};


const ScriptContainer = createReactClass({
    getInitialState(){
        return {}
    },

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ error:true});
    },

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
        if(this.state.error)
            return <div style={styles.error}>
                Plugin crashed
            </div>;

        const Component = this.props.component;
        let content;
        if (Component)
            content = <Component
                {...this.props.passedProps}
                id={this.props.id}
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
        size = get(state, 'redis', 'instance-size') || 'medium';
    return {
        component: get(state, 'scripts', ownProps.id, 'component'),
        size,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLoad(){
            dispatch(fetch(ownProps.id));
            dispatch(fetchAndSubscribe({
                command: 'hgetall',
                args: ['instance-size']
            }));
        },
        onUnload(){
            dispatch(unsubscribe('write:instance-size'));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptContainer);