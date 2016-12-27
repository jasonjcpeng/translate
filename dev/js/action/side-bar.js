import * as Constants from './CONSTANTS';

export const menuScroll = e=>{
    return {
        type:Constants.SIDE_BAR_MENU_SCROLL,
        payload:e
    }
}
export const meunItemToggle = (parentCode,e,isHasChild)=>{
    return {
        type:Constants.SIDE_BAR_MENU_ITEM_TOGGLE,
        parentCode:parentCode,
        isHasChild:isHasChild,
        payload:e
    }
}