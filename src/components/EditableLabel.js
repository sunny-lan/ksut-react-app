import React, {Component} from 'react';
import {Label} from "office-ui-fabric-react/lib/Label";
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import autoBind from 'auto-bind';

export default class EditableLabel extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this._handleCommit = this._handleCommit.bind(this);
        this.state = {pendingText: null};
        this.props.onLoad();
    }

    _handleLabelClick() {
        this.setState({pendingText: this.props.value});
    }

    _handleKeyPressed(keyPressed) {
        if (keyPressed.key === 'Enter')
            this._handleCommit();
    }

    _handleCommit() {
        let text = this.state.pendingText;
        if (!text)
            text = null;
        this.props.onCommit(text);
        this.setState({pendingText: null});
    }

    _handleChanged(newValue) {
        this.setState({
            pendingText: newValue,
        });
    }

    render() {
        if (this.state.pendingText !== null)
            return <TextField
                value={this.state.pendingText}
                onBlur={this._handleCommit}
                onKeyPress={this._handleKeyPressed}
                onChanged={this._handleChanged}
            />;
        else
            return <Label onClick={this._handleLabelClick}>
                {this.props.value}
            </Label>
    }
}