import React from 'react';
import createReactClass from 'create-react-class';
import Sidebar from './ScriptExplorer';
import ScriptEditor from './ScriptEditor';
import {BrowserView, MobileView, isBrowser} from 'react-device-detect';

const styles = {
    main: {
        height: '100%',
        position: 'absolute',//TODO sketchy hak
        width: '100%',
        display: 'flex',
    },
    content: {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const HomePage = createReactClass({
    getInitialState(){
        return {
            currentScript: null,
        };
    },

    handleScriptClick(id){
        this.setState({
            currentScript: id,
        });
    },

    handleScriptEdit(id){
        this.setState({
            currentScript: id,
        });
    },

    render() {
        let content;
        if (isBrowser && this.state.currentScript)
            content = <ScriptEditor id={this.state.currentScript}/>;

        return <div>
            <BrowserView style={styles.main}>
                <Sidebar onScriptClick={this.handleScriptClick}/>
                <div style={styles.content}>{content}</div>
            </BrowserView>
            <MobileView>
                Developer mode not available on mobile
            </MobileView>
        </div>
    },
});

export default HomePage;