import * as Constants from './CONSTANTS';
import {appStart} from '../services/api';

export const screenHeightListenner = (height,width)=>{
    return ({
        type:Constants.APP_SCREEN_HEIGHT_LISTENNER,
        height:height,
        width:width
    });
}


export const AppDidMount = ()=>{
    return dispatch=>{
        return appStart().then(e=>{
            return dispatch({
                type:Constants.INIT_CONTAINER_APP_DID_MOUNT,
                payload:e
            });
        }).catch(e=>{
            return dispatch({
                type:Constants.INIT_CONTAINER_APP_DID_MOUNT,
                error:e
            });
        })
    };
}
