import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {Dialog, DialogType, DialogFooter} from 'office-ui-fabric-react/lib/Dialog';
import {PrimaryButton, DefaultButton} from 'office-ui-fabric-react/lib/Button';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {NotificationManager} from 'react-notifications';

const RenameDialog = createReactClass({
    getInitialState(){
        return {};
    },

    async save(){
        try {
            await this.props.rename(this.props.id, this.state.newValue);
        } catch (error) {
            NotificationManager.error(error.message, 'Rename failed');
        } finally {
            this.closeDialog();
        }
    },

    closeDialog(){
        this.setState({newValue:undefined});
        this.props.onDismiss();
    },

    handleTextChange(e, newValue){
        this.setState({...this.state, newValue});
    },

    handleKeyPress(keyPressed) {
        if (keyPressed.key === 'Enter')
            this.save();
    },

    render(){
        let textValue;
        if (this.state.newValue === undefined)
            textValue = this.props.value;
        else textValue = this.state.newValue;
        return <Dialog
            hidden={this.props.hidden}
            onDismiss={this.closeDialog}
            dialogContentProps={{
                type: DialogType.normal,
                title: 'Rename',
            }}
        >
            <TextField
                placeholder={this.props.id}
                value={textValue}
                onChange={this.handleTextChange}
                onKeyPress={this.handleKeyPress}
            />
            <DialogFooter>
                <PrimaryButton onClick={this.save} text="Save"/>
                <DefaultButton onClick={this.closeDialog} text="Cancel"/>
            </DialogFooter>
        </Dialog>
    },
});

function mapStateToProps(state) {
    return {
        async rename(id, name){
            if (name)
                await state.connection.s('redis:hset', 'id-name', id, name);
            else
                await state.connection.s('redis:hdel', 'id-name', id);
        },
    };
}

export default connect(mapStateToProps)(RenameDialog);