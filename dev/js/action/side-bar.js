import * as Constants from './CONSTANTS';
import menuSetting from '../../jsons/meun-setting.json';
import {apiChangeUserInfo} from '../services/api';
import {AppDidMount} from './app';

export const menuScroll = e=>{
    return {
        type:Constants.SIDE_BAR_MENU_SCROLL,
        payload:e
    }
}
export const meunItemToggle = (e,isNoView)=>{
    return {
        type:Constants.SIDE_BAR_MENU_ITEM_TOGGLE,
        isNoView:isNoView,
        payload:e
    }
}

export const deleteQuickButton = (userInfo,deleteQuickId)=>{
    let userID = userInfo.id;
    let arg ={quickButton:[]}
    for(let i in userInfo.quickButton){
        if(userInfo.quickButton[i].id !== deleteQuickId){
            arg.quickButton.push(userInfo.quickButton[i]);
        }
    }
    return dispatch=>{
        apiChangeUserInfo(userID,arg).then(resData=>{
            dispatch(AppDidMount());
            return dispatch({
                type:Constants.CONTENT_SETTING_CHANGE_USER_INFO,
                userInfo:arg,
            });
        }).catch(rejData=>{
        });
    }
}

export const miniMenuToggle = (defaultToggleStatus,toggleStatus)=>{
    return ({
        type:Constants.HEADER_TOGGLE,
        defaultToggleStatus:defaultToggleStatus,
        toggleStatus:toggleStatus
    });
}

export const miniMenuItemHover = (v)=>{
    return ({
        type:Constants.SIDE_BAR_MINI_MENU_HOVER_MENU,
        payload:v
    });
}

export const selectSettingMenu= () =>{
    let e = menuSetting;
    return ({
        type:Constants.SIDE_BAR_MENU_ITEM_TOGGLE,
        isNoView:false,
        payload:e
    });
}