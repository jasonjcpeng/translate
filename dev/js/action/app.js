import * as Constants from './CONSTANTS';
import {appStart} from '../services/api';


//从locationStorage中获取store
export const reloadFromLocalStorage = state =>{
    return  ({
        type:Constants.APP_RELOAD_FROM_LOCAL_STORAGE,
        payload:state
    });
}

//屏幕分辨率的监听ACTION
export const screenHeightListenner = (height,width)=>{
    return ({
        type:Constants.APP_SCREEN_HEIGHT_LISTENNER,
        height:height,
        width:width
    });
}

//用户菜单信息，个人信息的初始化
export const AppDidMount = ()=>{
    console.log("APP INIT!");
    return dispatch=>{
        dispatch(AppIsReload(true));
        return appStart().then(e=>{
            dispatch(AppIsReload(false));
            return dispatch({
                type:Constants.INIT_CONTAINER_APP_DID_MOUNT,
                payload:e,
                error:undefined
            });
        }).catch(e=>{
            dispatch(AppIsReload(false));
            return dispatch({
                type:Constants.INIT_CONTAINER_APP_DID_MOUNT,
                error:e
            });
        })
    };
}
//‘加载中’遮罩的action,本action加载与异步action中
export const AppIsReload = (isReload)=>{
    return({
        type:Constants.APP_IS_RELOAD,
        isReload:isReload
    });
}