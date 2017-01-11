import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    menuScrollX:0,
    activeContent:[],
    sideBarCheck:true,
    limit:0,
    cursor:0,
    contentWidth:0
}

export default function (state=initState,action) {
    switch (action.type){
        case Constants.CONTAINER_TITTLE_MENU_SCROLL:
            return update(state,{menuScrollX:{$set:action.payload}});
            break;
        case Constants.SIDE_BAR_MENU_ITEM_TOGGLE:
            if(!action.isHasChild){
                let Push = true;
                let newState = update(state,{activeContent:{$apply:function(arr){
                    if(arr.length>0){
                        return arr.map(function(v){
                            if(v.obj.id===action.payload.id){
                                Push = false;
                                return {
                                    obj:v.obj,
                                    active:true,
                                    status:v.status
                                }
                            }else{
                                return {
                                    obj:v.obj,
                                    active:false,
                                    status:v.status
                                }
                            }
                        })
                    }else{
                        return [];
                    }
                }},sideBarCheck:{$set:true}});
                if(Push){
                    return update(newState,{activeContent:{$push:[{obj:action.payload,active:true,status:{}}]}});
                }else{
                    return newState;
                }
            }
            break;
        case Constants.CONTAINER_TITTLE_MENU_SET_LIMIT_AND_CURSOR:
            if(state.sideBarCheck){
                return update(state,{sideBarCheck:{$set:false},limit:{$set:action.limit},cursor:{$set:action.cursor},menuScrollX:{$set:action.cursor}});
            }else{
                return update(state,{limit:{$set:action.limit},cursor:{$set:action.cursor}});
            }
            break;
        case Constants.CONTAINER_TITTLE_MENU_SELECT_ACTIVE_CONTENT:
            return update(state,{activeContent:{$apply:function(arr){
                return arr.map(function(v){
                    if(v.obj.id === action.payload.obj.id){
                        return ({
                            obj:v.obj,
                            active:true,
                            status:v.status
                        });
                    }else{
                        return ({
                            obj:v.obj,
                            active:false,
                            status:v.status
                        });
                    }

                });
            }},sideBarCheck:{$set:true}});
            break;
        case Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT:
            return update(state,{activeContent:{$splice:[[action.key,1]]}});
            break;
    }
    return state;
}
