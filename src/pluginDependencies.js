import React from 'react';
import createReactClass from 'create-react-class';
import {connect} from 'react-redux';

import {Label} from 'office-ui-fabric-react/lib/Label';
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';

import * as util from './util';
import * as actions from './actions';

export default{
    'react': React,
    'react-redux': {connect},
    'create-react-class': createReactClass,

    'office-ui-fabric-react/lib/Label': {Label},
    'office-ui-fabric-react/lib/Button': {DefaultButton},

    './util': util,
    './actions': actions,
};