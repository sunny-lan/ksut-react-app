import {connect} from 'react-redux';
import EditableLabel from './EditableLabel';
import {fetchAndSubscribe, write} from '../actions';

function get(obj, ...keys) {
    for (let i = 0; i < keys.length; i++) {
        if (obj === undefined)return obj;
        obj = obj[keys[i]];
    }
    return obj;
}

function mapStateToProps(state, ownProps) {
    return {
        value: get(state, 'redis', 'name', ownProps.id) || ownProps.id,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLoad(){
            dispatch(fetchAndSubscribe({
                command: 'hget',
                args: ['name', ownProps.id]
            }))
        },
        onCommit(text){
            dispatch(write({
                command: 'hset',
                args: ['name', ownProps.id, text]
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditableLabel);
