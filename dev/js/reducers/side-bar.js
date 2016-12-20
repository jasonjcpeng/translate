import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    userInfo:{
        name:'',
        power:'',
        imgUrl:''
    },
    userMenu:[{icon:'',item_1:'',item_2:''}]
}
export default function (state=initState,action) {
    switch (action.type){
        case Constants.INIT_CONTAINER_APP_DID_MOUNT:
           return update(state,{$set:action.payload.sideBar});
            break;
    }
    return state;
}
