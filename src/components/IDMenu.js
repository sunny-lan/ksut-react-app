import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {ContextMenu, MenuItem} from "react-contextmenu";
import {Dialog, DialogType, DialogFooter} from 'office-ui-fabric-react/lib/Dialog';
import {PrimaryButton, DefaultButton} from 'office-ui-fabric-react/lib/Button';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {NotificationManager} from 'react-notifications';

const style = {
    menu: {
        background: 'white',
        boxShadow: '0 5px 10px 0 rgba(0,0,0,0.2),0 5px 10px 0 rgba(0,0,0,0.19)',
    },
    menuItem: {
        minWidth: '150px',
        padding: '5px',
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

const IDMenu = createReactClass({
    getInitialState(){
        return {dialogOpen: false};
    },

    handleRenameClick(e, data){
        this.setState({
            dialogOpen: true,
            newName: data.name,
            id: data.id,
        });
    },

    async save(){
        try {
            await this.props.rename(this.state.id, this.state.newName);
        } catch (error) {
            NotificationManager.error(error.message, 'Rename failed');
        } finally {
            this.closeDialog();
        }
    },

    closeDialog(){
        this.setState({dialogOpen: false});
    },

    handleTextChange(e, newName){
        this.setState({...this.state, newName});
    },

    render(){
        return <div>
            <ContextMenu id='MENU_ID' style={style.menu}>
                <MenuItem onClick={this.handleRenameClick}>
                    <div style={style.menuItem}><p>Rename</p></div>
                </MenuItem>
            </ContextMenu>
            <Dialog
                hidden={!this.state.dialogOpen}
                onDismiss={this.closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Rename',
                }}
            >
                <TextField
                    placeholder={this.state.id}
                    value={this.state.newName}
                    onChange={this.handleTextChange}
                />
                <DialogFooter>
                    <PrimaryButton onClick={this.save} text="Save"/>
                    <DefaultButton onClick={this.closeDialog} text="Cancel"/>
                </DialogFooter>
            </Dialog>
        </div>
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

export default connect(mapStateToProps)(IDMenu);