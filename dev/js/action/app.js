import * as Constants from './CONSTANTS';
import {appStart,login} from '../services/api';


export const appLogin = (userName,psw)=>{
    let store = JSON.parse(window.localStorage.getItem('store'));
    //判断是否需要重新初始化
    let isNeedInit =(userID)=>{
        let flag = false;
        if(!store){
            flag = true;
        }else if(store.common.error){
            flag = true;
        }else if(store.sideBar.userInfo.userID!==userID){
            flag = true
        }
        return flag;
    }
    return dispatch=>{
        return login().then(data=>{
            console.log("Login:"+data);
            if(isNeedInit(data)){
                dispatch(AppDidMount());
            }else{
                dispatch(reloadFromLocalStorage(store));
            }
            return dispatch({
                type:Constants.APP_USER_LOGIN,
                payload:true,
            });
        }).catch(rej=>{
            console.log(rej);
        })
        }
}

export const reloadFromLocalStorage = state =>{
    return  ({
        type:Constants.APP_RELOAD_FROM_LOCAL_STORAGE,
        payload:state
    });
}


export const screenHeightListenner = (height,width)=>{
    return ({
        type:Constants.APP_SCREEN_HEIGHT_LISTENNER,
        height:height,
        width:width
    });
}


export const AppDidMount = ()=>{
    console.log("APP INIT!");
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
