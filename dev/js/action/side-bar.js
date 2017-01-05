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
        type:Constants.CONTAINER_HEADER_TOGGLE,
        defaultToggleStatus:defaultToggleStatus,
        toggleStatus:toggleStatus
    });
}