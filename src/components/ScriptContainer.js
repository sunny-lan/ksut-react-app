import React, {Component} from 'react';
import {connect} from 'react-redux';
import {get} from '../util';
import {fetchIntoStore} from '../actions';

class ScriptContainer extends Component {
    constructor(props){
        super(props);
        this.props.loadData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.id !== this.props.id) {
            nextProps.loadData();
        }
    }

    render() {
        const Component = this.props.script;
        if (Component)
            return <Component {...this.props.passedProps}/>;
        else return <div/>;
    }
}

function mapStateToProps(state, ownProps) {
    return {
        script: get(state, 'loadedScripts', ownProps.id),
        passedProps: {
            id: ownProps.id,
        },
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        loadData(){
            dispatch(fetchIntoStore({
                command: 'hget',
                args: ['script-compiled', ownProps.id]
            }));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptContainer);