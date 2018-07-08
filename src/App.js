import React, { Component } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import pluginComps from './pluginDependencies';
import jsx from 'jsx-transform';

const koolscript=`
    return (class App extends Component {
        render() {
            return (
                <h1>hello</h1>
            );
        }
    });
`;

function load(script){
    script=jsx.fromString(script, {factory:'React.createComponent'});
    return eval(`((React,Component,components)=>{${script}})`)(React,Component,pluginComps);
}

const Kool=load(koolscript);

class App extends Component {
    render() {
        return (
            <Fabric>
                <Kool/>
            </Fabric>
        );
    }
}

export default App;
