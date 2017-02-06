import * as Constants from './CONSTANTS';

export const menuScroll = e=>{
    return {
        type:Constants.SIDE_BAR_MENU_SCROLL,
        payload:e
    }
}
export const meunItemToggle = (e,isHasChild)=>{
    return {
        type:Constants.SIDE_BAR_MENU_ITEM_TOGGLE,
        isHasChild:isHasChild,
        payload:e
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
    let e = {
        "icon": "fa-home",
        "id": 'setting',
        "code": "",
        "parentCode": "",
        "url": "",
        "menuName": "设置",
        "menuSort": 0,
        "isEnable": true,
        "createtime": "",
        "updatetime": ""
    };
    return ({
        type:Constants.SIDE_BAR_MENU_ITEM_TOGGLE,
        isHasChild:false,
        payload:e
    });
}