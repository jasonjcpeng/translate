import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    getReady:false,
    nowOnContentTarget: null
};

export default function (state=initState,action) {
    switch (action.type) {
        case Constants.INIT_CONTAINER_APP_DID_MOUNT:
            return update(state,{getReady:{$set:true}});
            break;
    }
    return state;
}
