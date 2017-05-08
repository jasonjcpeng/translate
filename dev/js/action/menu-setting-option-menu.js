import * as Constants from './CONSTANTS';
import {isOnline} from '../config/config';
import {menuSettingOptionMenuFetchViewPointConfig, insertTableMenu,modifyTableMenu} from '../services/api';
import {AppDidMount} from './app';

export const GetMount = (target)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_MENU_DID_MOUNT,
        target: target
    });
}

export const checkIsRootMenu = (targetMenuSort, bol)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_CHECK_IS_ROOT_MENU,
        payload: bol,
        targetMenuSort: targetMenuSort
    });
}

export const clickNextStep = (targetMenuSort, order)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_ONCLICK_NEXT_STEP,
        payload: order,
        targetMenuSort: targetMenuSort
    });
}

export const clickChangeSetp = (targetMenuSort, order)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_ONCLICK_CHANGE_STEP,
        payload: order,
        targetMenuSort: targetMenuSort
    });
}

export const toggleIconSetting = (targetMenuSort, iconName)=> {
    if (iconName !== undefined) {
        return ({
            type: Constants.MENU_SETTING_TOGGLE_ICON_SETTING,
            targetMenuSort: targetMenuSort,
            icon: iconName
        });
    } else {
        return ({
            type: Constants.MENU_SETTING_TOGGLE_ICON_SETTING,
            targetMenuSort: targetMenuSort
        });
    }
}

export const changeMenuData = (targetMenuSort, key, val)=> {
    return ({
        type: Constants.MENU_SETTING_CHANGE_MENU_DATA,
        targetMenuSort: targetMenuSort,
        key: key,
        value: val
    });
}

export const closeMenuSetting = (k, nowOnContent)=> {
    return ({
        type: Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT,
        key: k,
        payload: nowOnContent
    });
}
export const selectActiveContent = e => {
    return ({
        type: Constants.CONTAINER_TITTLE_MENU_SELECT_ACTIVE_CONTENT,
        payload: e
    });
}

export const clickFinish = (targetMenuSort, menuData,activeContent, nowOnContentKey, obj,modifyFlag)=> {
    let deleteActiveContent = (k, v,activeContent, dispatch)=> {
        dispatch(closeMenuSetting(k, v));
        let result = null;
        if (k > 0 && k + 1 === activeContent.length) {
            result = activeContent[k - 1];
        } else if (activeContent.length > 0) {
            result = activeContent[k + 1];
        }
        result ? dispatch(selectActiveContent(result)) : '';
    }
    //api判断增加"/"
    if(menuData.api&&menuData.api.lastIndexOf('/')!==(menuData.api.length-1)){
        menuData.api+='/';
    }
    //viewPoint的Api判断增加"/"
    if(menuData.viewPoint.length>0){
        menuData.viewPoint = menuData.viewPoint.map(v=>{
            if(v.api&&v.api.lastIndexOf('/')!==(v.api.length-1)){
                v.api+='/';
                return v
            }else{
                return v
            }
        });
    }
    //btnGroup的Api判断增加"/"
    if(menuData.btnGroup.length>0){
        menuData.btnGroup = menuData.btnGroup.map(v=>{
            if(v.api&&v.api.lastIndexOf('/')!==(v.api.length-1)){
                v.api+='/';
                return v
            }else{
                return v
            }
        });
    }
    //modifyViewPoint的Api判断增加"/"
    if(menuData.modifyViewPoint.length>0){
        menuData.modifyViewPoint = menuData.modifyViewPoint.map(v=>{
            if(v.api&&v.api.lastIndexOf('/')!==(v.api.length-1)){
                v.api+='/';
                return v
            }else{
                return v
            }
        });
    }
    if (isOnline) {
        if(modifyFlag){
                //修改菜单
            return dispatch=> {
                modifyTableMenu(menuData).then(data=> {
                    dispatch(AppDidMount());
                    deleteActiveContent(nowOnContentKey, obj, activeContent, dispatch);
                    return dispatch({
                        type: Constants.MENU_SETTING_MODIFY_MENU_FINISH,
                        targetMenuSort: targetMenuSort,
                        error: undefined
                    })
                }).catch(res=> {
                    return dispatch({
                        type: Constants.MENU_SETTING_MODIFY_MENU_FINISH,
                        targetMenuSort: targetMenuSort,
                        error: res
                    })
                });
            }
        }else{
            return dispatch=> {
                //添加菜单
                insertTableMenu(menuData).then(data=> {
                    deleteActiveContent(nowOnContentKey, obj, activeContent, dispatch);
                    dispatch(AppDidMount());
                    return dispatch({
                        type: Constants.MENU_SETTING_ADD_MENU_FINISH,
                        targetMenuSort: targetMenuSort,
                        error: undefined
                    })
                }).catch(res=> {
                    return dispatch({
                        type: Constants.MENU_SETTING_ADD_MENU_FINISH,
                        targetMenuSort: targetMenuSort,
                        error: res
                    })
                })
            }
        }
    } else {
        return dispatch=> {
            deleteActiveContent(nowOnContentKey, obj,activeContent, dispatch);
            return dispatch({
                type: Constants.MENU_SETTING_ADD_MENU_TO_SIDE_BAR,
                targetMenuSort: targetMenuSort,
                payload: menuData,
            })
        };
    }
}

//callback 如果拿到数据就运行这个回调
export const getViewPointConfig = (targetMenuSort, ViewPointConfigApi, targetMenu,callback)=> {
    return dispatch=> {
        menuSettingOptionMenuFetchViewPointConfig(ViewPointConfigApi).then(
            res=> {
                callback();
                return dispatch({
                    type: Constants.MENU_SETTING_GET_VIEW_POINT_CONFIG,
                    targetMenu:targetMenu,
                    targetMenuSort: targetMenuSort,
                    payload: res
                });
            }).catch(
            rej=> {
                return dispatch({
                    type: Constants.MENU_SETTING_GET_VIEW_POINT_CONFIG,
                    targetMenuSort: targetMenuSort,
                    error: '读取失败!'
                });
            }
        );
    }
}

export const changePreviewStatus = (targetMenuSort, previewStatus)=> {
    return {
        type: Constants.MENU_SETTING_CHANGE_PREVIEW_STATUS,
        targetMenuSort: targetMenuSort,
        previewStatus: !previewStatus
    };
}

export const sendError = (targetMenuSort, message)=> {
    return ({
        type: Constants.MENU_SETTING_SEND_ERROR_MESSAGE,
        targetMenuSort: targetMenuSort,
        error: message
    });
}



