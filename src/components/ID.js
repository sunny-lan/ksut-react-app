import {connect} from 'react-redux';
import EditableLabel from './EditableLabel';
import {fetchAndSubscribe, write} from '../actions';
import {get} from '../util';

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
