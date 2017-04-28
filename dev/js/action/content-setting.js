import * as Constants from './CONSTANTS';
import {isOnline} from '../config/config';
import {GetMount} from './menu-setting-option-menu';
import {apiDeleteMenu,apiChangeUserInfo,apiResetPassWord} from '../services/api';

export const contentSettingGetMount = (target)=> {
    return ({
        type: Constants.CONTENT_SETTING_INIT,
        target: target
    });
}

export const checkRightActiveContainer = (menuSort, v)=> {
    return ({
        type: Constants.CONTENT_SETTING_CHECK_RIGHT_ACTIVE_CONTAINER,
        menuSort: menuSort,
        payload: v
    });
}

export const changeSkin = (v)=> {
    //ToDo:change Skin!fetch to dataBase if success then return
    if(isOnline){
        return dispatch=> {
            return dispatch({
                type: Constants.CONTENT_SETTING_CHANGE_SKIN,
                payload: v
            })
        };
    }else{
        return ({
            type: Constants.CONTENT_SETTING_CHANGE_SKIN,
            payload: v
        });
    }

}

/*//改变当前菜单的可用状态
export const changeMenuSetting = (v)=>{
    //ToDo:Change menu!fetch to dataBase if success then return
    if(isOnline){
        return dispatch=> {
            return dispatch({
                type: Constants.CONTENT_SETTING_CHANGE_MENU,
                payload: v
            })
        };
    }else{
        return ({
            type: Constants.CONTENT_SETTING_CHANGE_MENU,
            payload: v
        });
    }

}*/

export const toggleSingleMenuItem = v=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_MENU_TOGGLE_TABLE_MENU_ITEM,
        payload:v
    });
}

export const toggleOffAllMenuItem = ()=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_MENU_TOGGLE_OFF_MENU_ITEM,
    });
}

export const selectSingleMenuItem = v=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_MENU_SELECT_TABLE_MENU_ITEM,
        payload:v
    })
}

export const openOption = v=>{
    return dispatch=>{
        if(v.targetMenu){
            dispatch(GetMount(v));
        }
        dispatch({
            type:Constants.SIDE_BAR_MENU_ITEM_TOGGLE,
            isHasChild:false,
            payload:v
        });
    }
}

export const optionDeleteMenu = v=>{
    if(isOnline){
        return dispatch=>{
            apiDeleteMenu(v).then(resData=>{
                return dispatch({
                    type:Constants.APP_DELETE_MENU_ITEM,
                    payload:v
                });
            }).catch(rej=>{
                return dispatch({
                    type:Constants.CONTENT_SETTING_SETTING_MENU_SEND_ERROR,
                    error:rej
                });
            })
        };
    }else{
        return ({
            type:Constants.APP_DELETE_MENU_ITEM,
            payload:v
        });
    }

}

export const actionSendError = (errorMessage)=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_MENU_SEND_ERROR,
        error:errorMessage
    });
}

export const actionIsOk = (okMessage)=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_IS_OK,
        ok:okMessage
    });
}

export const actionChangeUserInfo = (userID,arg)=>{
    if(isOnline){
        return dispatch=>{
            apiChangeUserInfo(userID,arg).then(resData=>{
                dispatch(actionIsOk('修改成功！'));
                return dispatch({
                    type:Constants.CONTENT_SETTING_CHANGE_USER_INFO,
                    userInfo:arg,
                });
            }).catch(rejData=>{
                return dispatch({
                    type:Constants.CONTENT_SETTING_SETTING_MENU_SEND_ERROR,
                    error:rejData
                });
            });
        }
    }else{


    }
}

export const actionResetPassWord = (account,userData)=>{
    if(isOnline){
        return dispatch=>{
            apiResetPassWord(account,userData).then(resData=>{
                dispatch(actionIsOk('修改成功！'));
                return dispatch({
                    type:Constants.CONTENT_SETTING_RESET_PASS_WORD,
                });
            }).catch(rejData=>{
                return dispatch({
                    type:Constants.CONTENT_SETTING_SETTING_MENU_SEND_ERROR,
                    error:rejData
                });
            });
        }
    }else{


    }
}