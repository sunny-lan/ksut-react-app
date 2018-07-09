import React from 'react';
import {Label} from "office-ui-fabric-react/lib/Label";

const styles = {
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
};

export default function render(props) {
    return (
        <div style={styles.main}>
            <Label>hello</Label>
        </div>
    );
};