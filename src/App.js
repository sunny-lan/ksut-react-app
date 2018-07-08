import React, { Component } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import {transform} from '@babel/standalone';
import CreateReactClass  from 'create-react-class';
import pluginComps from './pluginDependencies';

const koolscript=`

    render() {
        const Label=components.Label;
        const Button=components.DefaultButton;
        return (<div>
            <Label>hello</Label>
            <Button onClick={()=>alert('helo')}>iewhr</Button>
            </div>
        );
    }
`;

function load(script){
    script=`(React, components)=>{return {${script}};}`;
    console.log(script);
    script=transform(script, {plugins:['transform-react-jsx']});
    return CreateReactClass(eval(script.code)(React, pluginComps));
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
