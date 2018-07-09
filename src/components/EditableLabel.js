import React, {Component} from 'react';
import {Label} from "office-ui-fabric-react/lib/Label";
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import autoBind from 'auto-bind';

export default class EditableLabel extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {};
    }

    componentWillMount(){
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
        this.props.onCommit(this.state.pendingText);
        this.setState({});
    }

    _handleChanged(newValue) {
        this.setState({
            pendingText: newValue,
        });
    }

    render() {
        if (this.state.pendingText !== undefined)
            return <TextField
                value={this.state.pendingText}
                onBlur={this._handleCommit}
                onKeyPress={this._handleKeyPressed}
                onChanged={this._handleChanged}
                borderless
            />;
        else
            return <Label onClick={this._handleLabelClick}>
                {this.props.value}
            </Label>
    }
}