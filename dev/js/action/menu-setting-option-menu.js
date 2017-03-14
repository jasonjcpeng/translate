import * as Constants from './CONSTANTS';

export const GetMount = (target)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_MENU_DID_MOUNT,
        target: target
    });
}

export const checkIsRootMenu = (bol)=>{
    return ({
        type:Constants.MENU_SETTING_OPTION_CHECK_IS_ROOT_MENU,
        payload:bol
    });
}

export const clickNextStep = order=>{
    return ({
        type:Constants.MENU_SETTING_OPTION_ONCLICK_NEXT_STEP,
        payload:order
    });
}

export const clickChangeSetp = order=>{
    return ({
        type:Constants.MENU_SETTING_OPTION_ONCLICK_CHANGE_STEP,
        payload:order
    });
}
