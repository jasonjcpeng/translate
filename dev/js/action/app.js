import * as Constants from './CONSTANTS';
import {appStart} from '../services/api';

export const screenHeightListenner = (height,width)=>{
    return ({
        type:Constants.APP_SCREEN_HEIGHT_LISTENNER,
        height:height,
        width:width
    });
}

function reSetAppDidMount(data){
    return {
        userInfo:data[0].userInfo,
        menu:data[1].menu
    }
}

export const AppDidMount = ()=>{
    return dispatch=>{
        return appStart().then(e=>{
            return dispatch({
                type:Constants.INIT_CONTAINER_APP_DID_MOUNT,
                payload:reSetAppDidMount(e)
            });
        }).catch(e=>{
            return dispatch({
                type:Constants.INIT_CONTAINER_APP_DID_MOUNT,
                error:e
            });
        })
    };
}
