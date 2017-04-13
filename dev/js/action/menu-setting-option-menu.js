import * as Constants from './CONSTANTS';
import {isOnline} from '../config/config';
import {menuSettingOptionMenuFetchViewPointConfig} from '../services/api';

export const GetMount = (target)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_MENU_DID_MOUNT,
        target: target
    });
}

export const checkIsRootMenu = (targetMenuSort,bol)=>{
    return ({
        type:Constants.MENU_SETTING_OPTION_CHECK_IS_ROOT_MENU,
        payload:bol,
        targetMenuSort: targetMenuSort
    });
}

export const clickNextStep = (targetMenuSort,order)=>{
    return ({
        type:Constants.MENU_SETTING_OPTION_ONCLICK_NEXT_STEP,
        payload:order,
        targetMenuSort: targetMenuSort
    });
}

export const clickChangeSetp = (targetMenuSort,order)=>{
    return ({
        type:Constants.MENU_SETTING_OPTION_ONCLICK_CHANGE_STEP,
        payload:order,
        targetMenuSort: targetMenuSort
    });
}

export const toggleIconSetting = (targetMenuSort,iconName)=>{
    if(iconName!==undefined){
        return ({
            type:Constants.MENU_SETTING_TOGGLE_ICON_SETTING,
            targetMenuSort: targetMenuSort,
            icon:iconName
        });
    }else{
        return ({
            type:Constants.MENU_SETTING_TOGGLE_ICON_SETTING,
            targetMenuSort: targetMenuSort
        });
    }
}

export const changeMenuData = (targetMenuSort,key,val)=>{
        return ({
            type:Constants.MENU_SETTING_CHANGE_MENU_DATA,
            targetMenuSort:targetMenuSort,
            key:key,
            value:val
        });
}

export const closeMenuSetting = (k,nowOnContent)=>{
    return ({
        type:Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT,
        key:k,
        payload:nowOnContent
    });
}
export const selectActiveContent= e =>{
    return ({
        type:Constants.CONTAINER_TITTLE_MENU_SELECT_ACTIVE_CONTENT,
        payload:e
    });
}

export const clickFinish = (menuData)=>{
    //ToDo:Add menu!fetch to dataBase if success then return
    if(isOnline){
        return dispatch=> {
            return dispatch({
                type: Constants.MENU_SETTING_ADD_MENU_TO_SIDE_BAR,
                payload: menuData
            })
        };
    }else{
        return ({
            type: Constants.MENU_SETTING_ADD_MENU_TO_SIDE_BAR,
            payload: menuData
        });
    }
}

//callback 如果拿到数据就运行这个回调
export const getViewPointConfig = (targetMenuSort,ViewPointConfigApi,callback)=>{
    return dispatch=> {
        menuSettingOptionMenuFetchViewPointConfig(ViewPointConfigApi).then(
            res=> {
                callback();
                return dispatch({
                    type: Constants.MENU_SETTING_GET_VIEW_POINT_CONFIG,
                    targetMenuSort: targetMenuSort,
                    payload: res
                });
            }).catch(
            rej=> {
                return dispatch({
                    type: Constants.MENU_SETTING_GET_VIEW_POINT_CONFIG,
                    targetMenuSort: targetMenuSort,
                    error: rej
                });
            }
        );
    }
}

export const sendError = (targetMenuSort,message)=>{
    return ({
        type:Constants.MENU_SETTING_SEND_ERROR_MESSAGE,
        targetMenuSort: targetMenuSort,
        error:message
    });
}

export const clickShieldAlertOK=(targetMenuSort)=>{
    return ({
        type:Constants.MENU_SETTING_RESET_ERROR,
        targetMenuSort: targetMenuSort
    });
}



