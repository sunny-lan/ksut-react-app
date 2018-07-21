import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Dashboard from './Dashboard';
import ScriptContainer from './InstanceContainer';
import ScriptChooser from './ScriptChooser';
import Bar from './Bar';
import DeveloperPage from './DeveloperPage';

const styles = {
    main: {
        display: 'flex',
        height: '100vh',
        flexDirection: 'column'
    },
    content: {
        flexGrow: 1,
        position: 'relative',
    },
    forceSize: {//TODO sketchy hak
        height: '100%',
        position: 'absolute',
        width: '100%',
    }
};

function ScriptFullscreen(props) {
    return <ScriptContainer
        instanceID={props.match.params.instanceID}
        maximized
    />
}

function HomePage(props) {
    return <div style={styles.main}>
        <Bar/>
        <div style={styles.content}>
            <Switch style={styles.forceSize}>
                <Route path="/search" component={ScriptChooser}/>
                <Route path="/developer" component={DeveloperPage}/>
                <Route path="/instances/:instanceID" render={ScriptFullscreen}/>
                <Route component={Dashboard}/>
            </Switch>
        </div>
    </div>
}

export default HomePage;