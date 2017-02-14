import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    loaded:false,
    error:undefined,
    count:0
}

export default (state=initState,action)=>{
    switch (action.type){
        case Constants.APP_RELOAD_FROM_LOCAL_STORAGE:
            return action.payload.contentSetting;
        case 'COUNT':
            return update(state,{count:{$set:action.payload}});
            break;
    }
    return state;
}
