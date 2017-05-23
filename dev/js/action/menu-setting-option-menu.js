import * as Constants from './CONSTANTS';
import {isOnline} from '../config/config';
import {menuSettingOptionMenuFetchViewPointConfig, insertTableMenu,modifyTableMenu} from '../services/api';
import {AppDidMount,AppIsReload} from './app';
//根据当前的目标菜单类型初始化选项卡内容
export const GetMount = (target)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_MENU_DID_MOUNT,
        target: target
    });
}
//选择作为根菜单选项
export const checkIsRootMenu = (targetMenuSort, bol)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_CHECK_IS_ROOT_MENU,
        payload: bol,
        targetMenuSort: targetMenuSort
    });
}
//选择作为自定义菜单选项
export const checkIsCustomMenu = (targetMenuSort, bol)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_CHECK_IS_CUSTOM_MENU,
        payload: bol,
        targetMenuSort: targetMenuSort
    });
}
//下一步
export const clickNextStep = (targetMenuSort, order)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_ONCLICK_NEXT_STEP,
        payload: order,
        targetMenuSort: targetMenuSort
    });
}
//跳选步骤
export const clickChangeSetp = (targetMenuSort, order)=> {
    return ({
        type: Constants.MENU_SETTING_OPTION_ONCLICK_CHANGE_STEP,
        payload: order,
        targetMenuSort: targetMenuSort
    });
}
//打开图标设定遮罩层
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
//改变菜单设定数据
export const changeMenuData = (targetMenuSort, key, val)=> {
    return ({
        type: Constants.MENU_SETTING_CHANGE_MENU_DATA,
        targetMenuSort: targetMenuSort,
        key: key,
        value: val
    });
}
//关闭菜单设定页
export const closeMenuSetting = (k, nowOnContent)=> {
    return ({
        type: Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT,
        key: k,
        payload: nowOnContent
    });
}
//选择当前活跃的标签页
export const selectActiveContent = e => {
    return ({
        type: Constants.CONTAINER_TITTLE_MENU_SELECT_ACTIVE_CONTENT,
        payload: e
    });
}
//完成
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
    if (isOnline){
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
        /*if(menuData.modifyViewPoint.length>0){
         menuData.modifyViewPoint = menuData.modifyViewPoint.map(v=>{
         if(v.api&&v.api.lastIndexOf('/')!==(v.api.length-1)){
         v.api+='/';
         return v
         }else{
         return v
         }
         });
         }*/
        if(modifyFlag){
                //修改菜单
            return dispatch=> {
                modifyTableMenu(menuData).then(data=> {
                    dispatch(AppDidMount());
                    deleteActiveContent(nowOnContentKey, obj, activeContent, dispatch);
                    return dispatch({
                        type: Constants.MENU_SETTING_MODIFY_MENU_FINISH,
                        targetMenuSort: targetMenuSort,
                        payload: menuData,
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
                dispatch(AppIsReload(true));
                //添加菜单
                insertTableMenu(menuData).then(data=> {
                    dispatch(AppIsReload(false));
                    deleteActiveContent(nowOnContentKey, obj, activeContent, dispatch);
                    dispatch(AppDidMount());
                    return dispatch({
                        type: Constants.MENU_SETTING_ADD_MENU_FINISH,
                        targetMenuSort: targetMenuSort,
                        error: undefined
                    })
                }).catch(res=> {
                    dispatch(AppIsReload(false));
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

//获取视图层对应的API数据
//@param callback 本函数then时运行这个回调
export const getViewPointConfig = (targetMenuSort, ViewPointConfigApi, targetMenu,callback)=> {
    return dispatch=> {
        dispatch(AppIsReload(true));
        menuSettingOptionMenuFetchViewPointConfig(ViewPointConfigApi).then(
            res=> {
                dispatch(AppIsReload(false));
                callback();
                return dispatch({
                    type: Constants.MENU_SETTING_GET_VIEW_POINT_CONFIG,
                    targetMenu:targetMenu,
                    targetMenuSort: targetMenuSort,
                    payload: res
                });
            }).catch(
            rej=> {
                dispatch(AppIsReload(false));
                return dispatch({
                    type: Constants.MENU_SETTING_GET_VIEW_POINT_CONFIG,
                    targetMenuSort: targetMenuSort,
                    error: '读取失败!'
                });
            }
        );
    }
}
//改变预览遮罩层打开状态
export const changePreviewStatus = (targetMenuSort, previewStatus)=> {
    return {
        type: Constants.MENU_SETTING_CHANGE_PREVIEW_STATUS,
        targetMenuSort: targetMenuSort,
        previewStatus: !previewStatus
    };
}
//发送错误信息
export const sendError = (targetMenuSort, message)=> {
    return ({
        type: Constants.MENU_SETTING_SEND_ERROR_MESSAGE,
        targetMenuSort: targetMenuSort,
        error: message
    });
}
//改变按钮配置层打开状态，通用搜索栏使用，已废弃
export const actionChangeButtonConfigPreviewStatus = (targetMenuSort,args)=>{
    return ({
        type: Constants.MENU_SETTING_CHANGE_BUTTON_CONFIG_PREVIEW_STATUS,
        target: targetMenuSort,
        nowOnButtonConfig: args
    });
}


