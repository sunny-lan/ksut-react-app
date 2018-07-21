import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {Nav} from 'office-ui-fabric-react/lib/Nav';
import {get} from '../util';
import {fetchAndSubscribe, unsubscribe} from '../actions';
import {namespace} from '../ksut-client/namespace';
import ID from "./ID";
import uuid from 'uuid/v4';

const style = {
    main: {
        width: "308px",
        boxSizing: "border-box",
        border: "1px solid #EEE",
        overflowY: "auto",
    },
    scriptLink: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minWidth: '0',
    },
    scriptID: {
        minWidth: '0',
        width: '100%',
    },
};

const Sidebar = createReactClass({
    componentDidMount(){
        this.props.onLoad();
    },

    componentWillUnmount(){
        this.props.onUnload();
    },

    handleLinkClick(event, link){
        if (link.type === 'SCRIPT')
            this.props.onScriptClick(link.name)
    },

    renderLink(link){
        if (link.type === 'SCRIPT')
            return <div onClick={() => this.props.onScriptClick(link.name)} style={style.scriptLink}>
                <ID id={link.name} style={style.scriptLink}/>
            </div>;
        return <div>{ link.name }</div>;
    },

    render() {
        return <div style={style.main}>
            <Nav
                groups={[{
                    links: [
                        {name: 'Create', onClick: this.props.onCreateScript, icon: 'Add'},
                        ...this.props.scriptLinks,
                    ]
                }]}
                onRenderLink={this.renderLink}
                expandedStateText={'expanded'}
                collapsedStateText={'collapsed'}
            />
        </div>
    }
});

function mapStateToProps(state) {
    return {
        scriptLinks: Object.keys(get(state, 'redis', 'script-code') || {})
            .map(key => {
                return {
                    name: key, type: 'SCRIPT', key
                };
            }),
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLoad(){
            dispatch(fetchAndSubscribe({
                command: 'hkeys',
                args: ['script-code']
            }));
        },
        onUnload(){
            dispatch(unsubscribe(namespace('write', 'script-code')));
        },
        onCreateScript(){
            const id = uuid();
            dispatch({type: 'SCRIPT_NEW', id});
            ownProps.onScriptClick(id);
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);