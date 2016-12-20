import {combineReducers} from 'redux';


import common from './common';
import sideBar from './side-bar';

const allReducers = combineReducers({
    common:common,
    sideBar:sideBar
});

export default allReducers;
