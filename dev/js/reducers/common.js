import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    getReady:false,
    windowHeight: 0,
    windowWidth:0,
    nowOnContentTarget: null,
    toggleStatus:''
};

export default function (state=initState,action) {
    switch (action.type) {
        case Constants.INIT_CONTAINER_APP_DID_MOUNT:
            return update(state,{getReady:{$set:true}});
            break;
        case Constants.APP_SCREEN_HEIGHT_LISTENNER:
            let newState = update(state, {windowHeight: {$set: action.height},windowWidth:{$set:action.width}});
            if(action.width<=300){
                return update(newState,{toggleStatus:{$set:'none'}});
            }else if(300<action.width&&action.width<=700){
                return update(newState,{toggleStatus:{$set:'mini'}});
            }else{
                return update(newState,{toggleStatus:{$set:'full'}});
            }
            break;

    }
    return state;
}
