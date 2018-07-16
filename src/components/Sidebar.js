import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';
import {Nav} from 'office-ui-fabric-react/lib/Nav';
import ID from './ID';
import {get} from '../util';
import {fetchAndSubscribe, unsubscribe} from '../actions';
import {namespace} from '../ksut-client/namespace';
import {IconButton} from 'office-ui-fabric-react/lib/Button';

const style = {
    main: {
        width: "408px",
        boxSizing: "border-box",
        border: "1px solid #EEE",
        overflowY: "auto",
    },
    scriptLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    scriptLinkIcon: {
        marginLeft: 'auto',
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
            this.props.onScriptClick(link.key)
    },

    renderLink(link){
        if (link.type === 'SCRIPT')
            return <div style={style.scriptLink}>
                <div onClick={() => this.props.onScriptClick(link.name)}>{link.name}</div>
                <IconButton
                    iconProps={ {iconName: 'Edit'} }
                    title='Edit'
                    ariaLabel='Edit'
                    onClick={() => this.props.onScriptEdit(link.name)}
                />
            </div>;
        return (<div>{ link.name }</div>);
    },

    render() {
        return <div style={style.main}>
            <Nav
                groups={[{
                    links: [
                        {
                            name: 'Scripts',
                            links: [
                                {name:'Create', onClick:this.props.onCreateScript},
                                ...this.props.scriptLinks,
                            ],
                            isExpanded: true,
                        },
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
        scriptLinks: Object.keys(get(state, 'redis', 'script-code')||{}).map(key => {
            return {
                name: key, type: 'SCRIPT'
            };
        }),
    };
}

function mapDispatchToProps(dispatch) {
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);