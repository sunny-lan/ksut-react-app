import React from 'react';
import createReactClass from 'create-react-class';
import uuid from 'uuid/v4';
import Sidebar from './Sidebar';
import ScriptContainer from './ScriptContainer';
import ScriptEditor from './ScriptEditor';

const styles = {
    main: {
        display: 'flex',
        height: '100vh',
    },
    content: {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

const HomePage = createReactClass({
    getInitialState(){
        return {
            currentScript: null,
            editing: false,
        };
    },

    handleScriptClick(id){
        this.setState({
            currentScript: id,
            editing: false,
        });
    },

    handleScriptEdit(id){
        this.setState({
            currentScript: id,
            editing: true,
        });
    },

    handleCreateScript(){
        this.setState({
            currentScript: uuid(),
            editing: true,
        })
    },

    render() {
        let content;
        if (this.state.currentScript) {
            if (this.state.editing)
                content = <ScriptEditor id={this.state.currentScript}/>;
            else
                content = <ScriptContainer maximized id={this.state.currentScript}/>;
        }
        return <div style={styles.main}>
            <Sidebar
                onScriptClick={this.handleScriptClick}
                onScriptEdit={this.handleScriptEdit}
                onCreateScript={this.handleCreateScript}
            />
            <div style={styles.content}>{content}</div>
        </div>
    },
});

export default HomePage;