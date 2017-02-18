import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    target:{},
    loaded:false,
    error:undefined,
    count:0
}

export default (state=initState,action)=>{
    switch (action.type){
        case Constants.APP_RELOAD_FROM_LOCAL_STORAGE:
            state = action.payload.contentSetting;
            return state;
        case 'CONTENT_SETTING_INIT':
            if(action.error){
                return update(state,{error:{$set:action.error},loaded:{$set:true}});
            }
            return update(state,{loaded:{$set:true},target:{$set:action.target}});
            break;
        case Constants.CONTAINER_TITTLE_MENU_CLOSE_ALL_ITEM:
            return initState;
            break;
        case Constants.CONTAINER_TITTLE_MENU_CLOSE_OTHER_ITEM:
            if(action.payload.id!==state.target.id){
                return initState;
            }
            break;
        case Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT:
            if(action.payload.id===state.target.id){
                return initState;
            }
            break;
        case 'COUNT':
            return update(state,{count:{$set:action.payload}});
            break;
    }
    return state;
}
