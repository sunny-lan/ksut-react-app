import React from 'react';
import {Label} from "office-ui-fabric-react/lib/Label";
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import createReactClass from 'create-react-class';
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";

const EditableLabel = createReactClass({
    getInitialState(){
        return {pendingText: null};
    },

    componentDidMount(){
        this.props.onLoad();
    },

    componentWillUnmount(){
        this.props.onUnload();
    },

    handleLabelClick() {
        this.setState({pendingText: this.props.value});
        setTimeout(() => this.nameInput.focus(), 0);
    },

    handleKeyPressed(keyPressed) {
        if (keyPressed.key === 'Enter')
            this.handleCommit();
    },

    handleCommit() {
        let text = this.state.pendingText;
        if (!text)
            text = null;
        this.props.onCommit(text);
        this.setState({pendingText: null});
    },

    handleChanged(newValue) {
        this.setState({
            pendingText: newValue,
        });
    },

    render() {
        if (this.state.pendingText !== null)
            return <TextField
                ref={(input) => {
                    this.nameInput = input;
                }}
                value={this.state.pendingText}
                onBlur={this.handleCommit}
                onKeyPress={this.handleKeyPressed}
                onChanged={this.handleChanged}
            />;
        else
            return <div>
                <ContextMenuTrigger id={this.props.id}>
                    <Label >
                        {this.props.value}
                    </Label>
                </ContextMenuTrigger>
                <ContextMenu id={this.props.id}>
                    <MenuItem onClick={this.handleLabelClick}>Edit</MenuItem>
                </ContextMenu>
            </div>
    },
});

export default EditableLabel;