import {combineReducers} from 'redux';


import common from './common';
import sideBar from './side-bar';
import containerTitleMenu from './container-title-menu';
import modifySearchGroupConfig from './modify-search-group-config';
import modifyShield from './modify-shield';

const allReducers = combineReducers({
    common:common,
    sideBar:sideBar,
    containerTitleMenu:containerTitleMenu,
    modifySearchGroupConfig:modifySearchGroupConfig,
    modifyShield:modifyShield
});

export default allReducers;
