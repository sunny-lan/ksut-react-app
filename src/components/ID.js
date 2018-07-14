import {connect} from 'react-redux';
import EditableLabel from './EditableLabel';
import {fetchAndSubscribe, write, unsubscribe} from '../actions';
import {get} from '../util';
import {namespace} from '../ksut-client/namespace';

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
        onUnload(){
            dispatch(unsubscribe(namespace('write', 'script-compiled')));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditableLabel);
