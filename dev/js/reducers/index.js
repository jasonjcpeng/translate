import {combineReducers} from 'redux';

import common from './common';

const allReducers = combineReducers({
    common:common
});

export default allReducers;
