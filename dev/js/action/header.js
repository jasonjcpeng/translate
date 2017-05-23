import * as Constants from './CONSTANTS';
//根据当前页面分辨率判断是否收起头部选项卡栏
export const toggle = (defaultToggleStatus,toggleStatus)=>{
    return ({
        type:Constants.HEADER_TOGGLE,
        defaultToggleStatus:defaultToggleStatus,
        toggleStatus:toggleStatus
    });
}

