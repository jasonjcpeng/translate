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
            return action.payload.modifySearchGroupConfig;
        case Constants.MODIFY_SEARCH_GROUP_CONFIG_INIT_STATE:
            let init = {
                target:action.target,
                dataHasCreated:[]
            }
            if(action.btnGroupConfig){
                init = {
                    target:action.target,
                    dataHasCreated:action.btnGroupConfig
                }
            }
            return update(state,{activeContent:{$push:[init]},loaded:{$set:true}});
            break;
        case Constants.MODIFY_SEARCH_GROUP_CONFIG_SAVE_DATA_HAS_CREATED:
            return setActiveContentStatusByTarget(state,action.target,{dataHasCreated:{$set:action.dataHasCreated}});
            break;

    }
    return state;
}