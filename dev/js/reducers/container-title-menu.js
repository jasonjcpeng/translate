import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    menuScrollX:0,
    activeContent:[]
}

export default function (state=initState,action) {
    switch (action.type){
        case Constants.CONTAINER_TITTLE_MENU_SET_DEFAULT_SCROLL_X:
            return update(state,{menuScrollX:{$set:action.payload}});
            break;
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
                                    active:true
                                }
                            }else{
                                return {
                                    obj:v.obj,
                                    active:false
                                }
                            }
                        })
                    }else{
                        return [];
                    }
                }}});
                if(Push){
                    return update(newState,{activeContent:{$push:[{obj:action.payload,active:true}]}});
                }else{
                    return newState;
                }
            }
            break;
    }
    return state;
}
