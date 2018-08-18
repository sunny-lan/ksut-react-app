import React from 'react';
import createReactClass from 'create-react-class';
import {ContextMenu, MenuItem} from "react-contextmenu";
import  RenameDialog from './RenameDialog';

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
        return {dialogHidden: true};
    },

    handleRenameClick(e, data){
        this.setState({
            dialogHidden: false,
            id: data.id,
            name: data.name,
        });
    },

    handleDismiss(){
        this.setState({dialogHidden: true});
    },

    render(){
        return <div>
            <ContextMenu id='MENU_ID' style={style.menu}>
                <MenuItem onClick={this.handleRenameClick}>
                    <div style={style.menuItem}><p>Rename</p></div>
                </MenuItem>
            </ContextMenu>
            <RenameDialog
                id={this.state.id}
                value={this.state.name}
                hidden={this.state.dialogHidden}
                onDismiss={this.handleDismiss}
            />
        </div>
    },
});

export default IDMenu;