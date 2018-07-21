import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {get} from '../util';
import {fetchAndSubscribe, unsubscribe} from '../actions';
import {namespace} from '../ksut-client/namespace';

const style = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const ID = createReactClass({
    componentDidMount(){
        this.props.onLoad();
    },

    componentWillUnmount(){
        this.props.onUnload();
    },

    render(){
        return <div style={style}>{this.props.name || this.props.id}</div>;
    },
});

function mapStateToProps(state, ownProps) {
    return {
        name: get(state, 'redis', 'id-name', ownProps.id),
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLoad(){
            dispatch(fetchAndSubscribe({
                command: 'hget',
                args: ['id-name', ownProps.id],
            }));
        },
        onUnload(){
            dispatch(unsubscribe(namespace('write', 'id-name')));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ID);