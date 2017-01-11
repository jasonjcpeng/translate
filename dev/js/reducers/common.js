import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    getReady:false,
    windowHeight: 0,
    windowWidth:0,
    nowOnContentTarget: null,
    toggleStatus:'',
    defaultToggleStatus:'',
    lastToggleStatus:''
};

export default function (state=initState,action) {
    switch (action.type) {
        case Constants.INIT_CONTAINER_APP_DID_MOUNT:
            return update(state,{getReady:{$set:true}});
            break;
        case Constants.CONTAINER_HEADER_TOGGLE:
            let newStatus = update(state,{lastToggleStatus:{$set:action.toggleStatus}});
            switch (action.defaultToggleStatus){
                case 'full':
                    switch (action.toggleStatus){
                        case 'full':
                            return update(newStatus,{toggleStatus:{$set:'mini'}});
                            break;
                        case 'mini':
                            return update(newStatus,{toggleStatus:{$set:'full'}});
                            break;
                        case 'none':
                            return update(newStatus,{toggleStatus:{$set:'full'}});
                            break;
                    }
                    break;
                case 'mini':
                    switch (action.toggleStatus){
                        case 'full':
                            return update(newStatus,{toggleStatus:{$set:'mini'}});
                            break;
                        case 'mini':
                            return update(newStatus,{toggleStatus:{$set:'full'}});
                            break;
                        case 'none':
                            return update(newStatus,{toggleStatus:{$set:'full'}});
                            break;
                    }
                    break;
                case 'none':
                    switch (action.toggleStatus){
                        case 'full':
                            return update(newStatus,{toggleStatus:{$set:'none'}});
                            break;
                        case 'mini':
                            return update(newStatus,{toggleStatus:{$set:'full'}});
                            break;
                        case 'none':
                            return update(newStatus,{toggleStatus:{$set:'full'}});
                            break;
                    }
                    break;
            }
            break;
        case Constants.APP_SCREEN_HEIGHT_LISTENNER:
            let newState = update(state, {windowHeight: {$set: action.height},windowWidth:{$set:action.width},lastToggleStatus:{$set:''}});
            if(action.width<=400){
                return update(newState,{toggleStatus:{$set:'none'},defaultToggleStatus:{$set:'none'}});
            }else if(400<action.width&&action.width<=700){
                return update(newState,{toggleStatus:{$set:'mini'},defaultToggleStatus:{$set:'mini'}});
            }else{
                return update(newState,{toggleStatus:{$set:'full'},defaultToggleStatus:{$set:'full'}});
            }
            break;
        case Constants.SIDE_BAR_MENU_ITEM_TOGGLE:
            if(!action.isHasChild){
                return update(state,{nowOnContentTarget:{$set:action.payload}});
            }
            break;
        case Constants.CONTAINER_TITTLE_MENU_SELECT_ACTIVE_CONTENT:
            return update(state,{nowOnContentTarget:{$set:action.payload.obj}});
            break;
        case Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT:
            if(action.key===0){
                return update(state,{nowOnContentTarget:{$set:null}});
            }
            break;
    }
    return state;
}
