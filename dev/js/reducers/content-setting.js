import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    loaded:false,
    error:undefined,
    count:0
}

export default (state=initState,action)=>{
    switch (action.type){
        case 'COUNT':
            return update(state,{count:{$set:action.payload}});
            break;
    }
    return state;
}
