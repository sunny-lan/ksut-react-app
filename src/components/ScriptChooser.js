import React from 'react';
import createReactClass from 'create-react-class';
import {SearchBox} from 'office-ui-fabric-react/lib/SearchBox';
import {ProgressIndicator} from 'office-ui-fabric-react/lib/ProgressIndicator';
import {connect} from 'react-redux';
import {List} from'office-ui-fabric-react/lib/List';
import ScriptContainer from './ScriptContainer';

const searchTime = 100;
const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        padding: '5px',
    },
    progress: {
        height: '10px',
    },
};


//TODO maybe move state to redux? idk
const ScriptChooser = createReactClass({
    getInitialState(){
        return {
            search: '',
            searching: false,
            searchResults: [],
        };
    },

    handleSearchChange(newValue){
        let timeout;
        if (!this.state.searching) {
            if (this.state.timeout)
                clearTimeout(this.state.timeout);
            timeout = setTimeout(this.doSearch, searchTime);
        }
        this.setState({
            ...this.state,
            search: newValue,
            timeout,
        });
    },

    doSearch(){
        this.setState({
            ...this.state,
            searching: true,
            timeout: undefined,
        });
        this.props.search(this.state.search)
            .then(searchResults => this.setState({
                ...this.state,
                searching: false,
                searchResults,
            }))
            .catch(error => this.setState({
                ...this.state,
                searching: false,
                errorMessage: error.message,
            }))
    },

    renderCell(item){
        return <ScriptContainer scriptID={item}/>
    },

    render(){
        return <div style={styles.main}>
            <SearchBox
                placeholder="Search for apps"
                onChange={this.handleSearchChange}
                value={this.state.search}
                underlined
            />
            <ProgressIndicator percentComplete={this.state.searching ? undefined : 0}/>
            <List
                items={this.state.searchResults}
                onRenderCell={this.renderCell}
            />
        </div>
    },
});
function mapStateToProps(state) {
    return {
        async search(str){
            return state.connection.send({
                command: 'script:search',
                args: [str.split(' ')],
            });
        },

        async onScriptPicked(scriptID){
            return state.connection.send({
                command: 'script:instantiate',
                args: [scriptID],
            });
        },
    };
}

export default connect(mapStateToProps)(ScriptChooser);