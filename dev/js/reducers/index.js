import {combineReducers} from 'redux';


import common from './common';
import sideBar from './side-bar';
import containerTitleMenu from './container-title-menu';

const allReducers = combineReducers({
    common:common,
    sideBar:sideBar,
    containerTitleMenu:containerTitleMenu
});

export default allReducers;
