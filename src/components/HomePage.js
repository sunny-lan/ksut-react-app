import React from 'react';
import {Label} from "office-ui-fabric-react/lib/Label";
import ID from './ID';
import ScriptContainer from './ScriptContainer';

const styles = {
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
};

export default function render(props) {
    return <div style={styles.main}>
        <Label>hello</Label>
        <ID id="admin"/>
        <ScriptContainer id="asdfscript"/>
    </div>
};