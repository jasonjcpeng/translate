import * as Constants from './CONSTANTS';
import menuSetting from '../../jsons/meun-setting.json';
import {apiChangeUserInfo} from '../services/api';
import {AppDidMount} from './app';
//菜单滚动
export const menuScroll = e=>{
    return {
        type:Constants.SIDE_BAR_MENU_SCROLL,
        payload:e
    }
}
//菜单展开收起
export const meunItemToggle = (e,isNoView)=>{
    return {
        type:Constants.SIDE_BAR_MENU_ITEM_TOGGLE,
        isNoView:isNoView,
        payload:e
    }
}
//假如快捷菜单的目标菜单已删除将调用这个方法删除存储在用户快捷菜单字段里的对应快捷菜单内容
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
//mini状态菜单栏展开收起
export const miniMenuToggle = (defaultToggleStatus,toggleStatus)=>{
    return ({
        type:Constants.HEADER_TOGGLE,
        defaultToggleStatus:defaultToggleStatus,
        toggleStatus:toggleStatus
    });
}
//mini菜单栏hover展开
export const miniMenuItemHover = (v)=>{
    return ({
        type:Constants.SIDE_BAR_MINI_MENU_HOVER_MENU,
        payload:v
    });
}
//打开设定选项卡
export const selectSettingMenu= () =>{
    let e = menuSetting;
    return ({
        type:Constants.SIDE_BAR_MENU_ITEM_TOGGLE,
        isNoView:false,
        payload:e
    });
}