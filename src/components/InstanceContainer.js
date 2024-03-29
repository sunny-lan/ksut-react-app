import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {get} from '../util';
import {fetchScript, fetchAndSubscribe, unsubscribe} from '../actions';
import {namespace} from '../ksut-client/namespace';
import {Link} from 'react-router-dom';
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';
import ID from './ID';
import {NotificationManager} from 'react-notifications';
import RenameDialog from './RenameDialog';

let styles = {
    common: {
        width: '100%',
        overflow: 'hidden',
        padding: '5px',
        boxSizing: 'border-box',
        display: 'flex',
    },
};
styles = {
    ...styles,
    compact: {
        ...styles.common,
        height: '40px',
        flexWrap: 'nowrap',
        borderBottom: 'solid 1px black',
    },
    medium: {
        ...styles.common,
        minHeight: '20vh',
        maxHeight: '33vh',
        flexDirection: 'column',
        borderBottom: 'solid 1px black',
    },
    maximized: {
        ...styles.common,
        height: '100%',
        flexDirection: 'column',
    },
    error: {
        color: 'red',
    },
    controlBar: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        flexShrink: '0',
    },
    link: {
        minWidth: 0,
        flexShrink: 1,
    },
    contextButton: {
        marginLeft: 'auto',
    },
    id: {}
};


const ScriptContainer = createReactClass({
    getInitialState(){
        return {dialogHidden: true};
    },

    componentDidCatch(error, info) {
        this.setState({error: true, dialogHidden: true});
    },

    componentDidMount(){
        this.props.onLoad();
        if (!this.props.scriptID)
            this.props.loadScriptID();
    },

    componentWillUnmount(){
        this.props.onUnload();
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.instanceID !== nextProps.instanceID)
            if (!nextProps.scriptID)
                nextProps.loadScriptID();

        if (nextProps.scriptID && this.props.scriptID !== nextProps.scriptID)
            nextProps.loadScript(nextProps.scriptID);
    },

    async handleDelete(){
        try {
            await this.props.onDelete();
            NotificationManager.success('Instance deleted');
        } catch (error) {
            NotificationManager.error(error, 'Failed to delete instance');
        }
    },

    handleRename(){
        this.setState({dialogHidden: false});
    },

    async handleReload(){
        try {
            this.props.loadScript(this.props.scriptID);
            await this.props.restart();
            NotificationManager.success('Instance reloaded');
        }catch(error){
            NotificationManager.error(error, 'Failed to reload instance');
        }
    },

    handleDialogDismiss(){
        this.setState({dialogHidden: true});
    },

    render()
    {
        if (this.state.error)
            return <div style={styles.error}>
                Plugin crashed
            </div>;

        const Component = this.props.component;
        let content = 'Loading...';
        if (Component)
            content = <Component
                {...this.props.passedProps}
                instanceID={this.props.instanceID}
                size={this.props.size}
            />;

        //todo actually make a user interface
        const contextMenu = <DefaultButton
            style={styles.contextButton}
            menuProps={{
                shouldFocusOnMount: true,
                items: [
                    {
                        key: 'delete', text: 'Delete',
                        onClick: this.handleDelete,
                    },
                    {
                        key: 'rename', text: 'Rename',
                        onClick: this.handleRename,
                    },
                    {
                        key: 'reload', text: 'Reload',
                        onClick: this.handleReload,
                    }
                ],
            }}
        />;

        const link = <Link style={styles.link} to={`/instances/${this.props.instanceID}`}>
            <ID style={styles.id} id={this.props.instanceID}/>
        </Link>;

        let html;

        if (this.props.size === 'compact')
            html = <div style={styles.compact}>
                {link}
                {content}
                {contextMenu}
            </div>;
        else
            html = <div style={this.props.maximized ? styles.maximized : styles.medium}>
                <div style={styles.controlBar}>
                    {link}
                    {contextMenu}
                </div>
                {content}
            </div>;

        return <div>
            {html}
            <RenameDialog
                id={this.props.instanceID}
                name={this.props.name}
                hidden={this.state.dialogHidden}
                onDismiss={this.handleDialogDismiss}
            />
        </div>
    }
});

function mapStateToProps(state, ownProps) {
    let size;
    if (ownProps.maximized)
        size = 'maximized';
    else
        size = get(state, 'redis', 'instance-size', ownProps.instanceID) || 'medium';
    const scriptID = get(state, 'redis', 'instance-script', ownProps.instanceID);
    const component = get(state, 'scripts', scriptID, 'component');
    return {
        name: get(state, 'redis', 'id-name', ownProps.id),
        scriptID,
        component,
        size,
        async onDelete(){
            await state.connection.send({
                command: 'script:destroyInstance',
                args: [ownProps.instanceID],
            });
        },
        async restart(){
            await state.connection.send({
                command:'redis:publish',
                args:[`restart:${ownProps.instanceID}`]
            });
        },
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLoad(){
            dispatch(fetchAndSubscribe({
                command: 'hget',
                args: ['instance-size', ownProps.instanceID],
            }));
            dispatch(fetchAndSubscribe({
                command: 'hget',
                args: ['id-name', ownProps.id],
            }));
        },
        onUnload(){
            dispatch(unsubscribe(namespace('write', 'instance-size')));
            dispatch(unsubscribe(namespace('write', 'instance-script')));
            dispatch(unsubscribe(namespace('write', 'id-name')));
        },
        loadScriptID(){
            dispatch(fetchAndSubscribe({
                command: 'hget',
                args: ['instance-script', ownProps.instanceID],
            }));
        },
        loadScript(scriptID){
            dispatch(fetchScript(scriptID));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptContainer);