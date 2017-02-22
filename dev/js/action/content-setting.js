import * as Constants from './CONSTANTS';

export const contentSettingGetMount = (target)=> {
    return ({
        type: Constants.CONTENT_SETTING_INIT,
        target: target
    });
}

export const checkRightActiveContainer = (menuSort, v)=> {
    return ({
        type: Constants.CONTENT_SETTING_CHECK_RIGHT_ACTIVE_CONTAINER,
        menuSort: menuSort,
        payload: v
    });
}

export const changeSkin = (v)=> {
    //ToDo:change Skin fetch to dataBase if success then return
    return dispatch=> {
        return dispatch({
            type: Constants.CONTENT_SETTING_CHANGE_SKIN,
            payload: v
        })
    };
}

export const changeMenuSetting = (v)=>{
    //ToDo:Change menu fetch to dataBase if success then return
    return dispatch=> {
        return dispatch({
            type: Constants.CONTENT_SETTING_CHANGE_MENU,
            payload: v
        })
    };
}
