import * as Constants from './CONSTANTS';

export const GetMount = (targetMenuSort)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_MENU_DID_MOUNT,
        targetMenuSort: targetMenuSort
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
    if(iconName){
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
