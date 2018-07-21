import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Dashboard from './Dashboard';
import ScriptContainer from './ScriptContainer';
import ScriptChooser from './ScriptChooser';
import Bar from './Bar';

const styles = {
    main: {
        display: 'flex',
        height: '100vh',
        flexDirection: 'column'
    },
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
        <Switch>
            <Route path="/search" component={ScriptChooser}/>
            <Route path="/instances/:instanceID" render={ScriptFullscreen}/>
            <Route component={Dashboard}/>
        </Switch>
    </div>
}

export default HomePage;