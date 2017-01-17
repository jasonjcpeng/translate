import * as Constants from './CONSTANTS';
export const toggle = (defaultToggleStatus,toggleStatus)=>{
    return ({
        type:Constants.HEADER_TOGGLE,
        defaultToggleStatus:defaultToggleStatus,
        toggleStatus:toggleStatus
    });
}

export const selectActiveContent= () =>{
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
