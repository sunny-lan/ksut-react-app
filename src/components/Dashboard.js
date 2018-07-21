import React from 'react';
import createReactClass from 'create-react-class';
import {List} from 'office-ui-fabric-react/lib/List';
import ScriptContainer from './InstanceContainer';
import {connect} from "react-redux";
import {get} from '../util';
import {fetchAndSubscribe, unsubscribe} from '../actions';
import {namespace} from '../ksut-client/namespace';

const styles = {
    list: {
        flexGrow: '1',
        width: '100%',
        overflow: 'auto',
    }
};

const Dashboard = createReactClass({
    componentDidMount(){
        this.props.onLoad();
    },

    componentWillUnmount(){
        this.props.onUnload();
    },

    render() {
        if (this.props.instanceIDs)
            return <List
                style={styles.list}
                items={this.props.instanceIDs}
                onRenderCell={this.renderCell}
            />;
        else return <div>
            dashboard empty, add using plus sign
        </div>
    },

    renderCell(item){
        return <ScriptContainer instanceID={item}/>
    },
});
function mapStateToProps(state) {
    const result = {instanceIDs: get(state, 'redis', 'instance-script')};
    if (result.instanceIDs)
        result.instanceIDs = Object.keys(result.instanceIDs);
    else
        result.loading = true;
    return result;
}

function mapDispatchToProps(dispatch) {
    return {
        onLoad(){
            dispatch(fetchAndSubscribe({
                command: 'hkeys',
                args: ['instance-script'],
            }));
        },
        onUnload(){
            dispatch(unsubscribe(namespace('write', 'instance-script')));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);