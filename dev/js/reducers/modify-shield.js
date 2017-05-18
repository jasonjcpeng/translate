import * as Constants from '../action/CONSTANTS'
import update from 'react-addons-update';
/**
 *
 * Created by Jason on 2017/5/9.
 */
const initState = {
    activeContent:[]
}
const setActiveContentStatusByTarget = (state,target,data)=>{
    return update(state, {
        activeContent: {
            $apply: function (arr) {
                return arr.map(function (v) {
                    if (v.target === target) {
                        return update(v, data);
                    } else {
                        return v;
                    }
                });
            }
        }
    });
}
export default (state=initState,action)=>{
    switch(action.type){
        case Constants.APP_RELOAD_FROM_LOCAL_STORAGE:
            return action.payload.modifyShield;
            break;
        case Constants.SHIELD_MODIFY_DID_MOUNT:
            let init = {
                target:action.targetID,
                data:{},
            }
            if(action.initData){
                init = {
                    target:action.targetID,
                    data:action.initData,
                }
            }
            return update(state,{activeContent:{$push:[init]}});
            break;
        case Constants.SHIELD_MODIFY_CLOSE_THIS:
            let index
            for(let i in state.activeContent){
                if(state.activeContent[i].target === action.targetID){
                    index = i;
                    break;
                }
            }
            return update(state,{activeContent: {$splice: [[index, 1]]}});
            break;
        case Constants.SHIELD_MODIFY_ON_CHANGE:
            return setActiveContentStatusByTarget(state,action.target,{data:{$set:action.data}});
            break;
        case Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT:
            return update(state,{activeContent: {$splice: [[action.key, 1]]}});
            break;
    }
    return state;
}