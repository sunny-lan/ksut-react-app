import React from 'react';
import createReactClass from 'create-react-class';
import {List} from 'office-ui-fabric-react/lib/List';
import ScriptContainer from './ScriptContainer';
import {connect} from "react-redux";
import {get} from '../util';
import {fetchAndSubscribe, unsubscribe} from '../actions';

const styles = {
    main: {
        display: 'flex',
        height: '100vh',
    },
    list: {
        width: '100%',
    }
};

const HomePage = createReactClass({
    componentDidMount(){
        this.props.onLoad();
    },

    componentWillUnmount(){
        this.props.onUnload();
    },

    render() {
        return <div style={styles.main}>
            <List
                style={styles.list}
                items={this.props.scriptIDs}
                onRenderCell={this.renderCell}
            />
        </div>
    },

    renderCell(item){
        return <ScriptContainer id={item}/>
    },
});
function mapStateToProps(state) {
    const result = {scriptIDs: get(state, 'redis', 'script-code')};
    if (result.scriptIDs)
        result.scriptIDs = Object.keys(result.scriptIDs);
    else
        result.loading = true;
    return result;
}

function mapDispatchToProps(dispatch) {
    return {
        onLoad(){
            dispatch(fetchAndSubscribe({
                command: 'hkeys',
                args: ['script-code'],
            }));
        },
        onUnload(){
            dispatch(unsubscribe('write:script-code'));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);