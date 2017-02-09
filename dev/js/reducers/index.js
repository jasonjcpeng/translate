import {combineReducers} from 'redux';


import common from './common';
import sideBar from './side-bar';
import containerTitleMenu from './container-title-menu';
import contentSetting from './content-setting';

const allReducers = combineReducers({
    common:common,
    sideBar:sideBar,
    containerTitleMenu:containerTitleMenu,
    contentSetting:contentSetting
});

export default allReducers;
