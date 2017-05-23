import * as Constants from './CONSTANTS';
import {isOnline} from '../config/config';
import {GetMount} from './menu-setting-option-menu';
import {AppDidMount,AppIsReload} from './app';
import {apiDeleteMenu,apiChangeUserInfo,apiResetPassWord,apiGetDataBabelDetail} from '../services/api';

//配置页面reducer初始化
export const contentSettingGetMount = (target)=> {
    return ({
        type: Constants.CONTENT_SETTING_INIT,
        target: target
    });
}
//选择当前右边内容框的渲染内容
export const checkRightActiveContainer = (menuSort, v)=> {
    return ({
        type: Constants.CONTENT_SETTING_CHECK_RIGHT_ACTIVE_CONTAINER,
        menuSort: menuSort,
        payload: v
    });
}
//改变皮肤
export const changeSkin = (v)=> {
    //ToDo:change Skin!fetch to dataBase if success then return
    if(isOnline){
        return dispatch=> {
            return dispatch({
                type: Constants.CONTENT_SETTING_CHANGE_SKIN,
                payload: v
            })
        };
    }else{
        return ({
            type: Constants.CONTENT_SETTING_CHANGE_SKIN,
            payload: v
        });
    }

}

/*//改变当前菜单的可用状态
export const changeMenuSetting = (v)=>{
    //ToDo:Change menu!fetch to dataBase if success then return
    if(isOnline){
        return dispatch=> {
            return dispatch({
                type: Constants.CONTENT_SETTING_CHANGE_MENU,
                payload: v
            })
        };
    }else{
        return ({
            type: Constants.CONTENT_SETTING_CHANGE_MENU,
            payload: v
        });
    }

}*/
//展开菜单项
export const toggleSingleMenuItem = v=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_MENU_TOGGLE_TABLE_MENU_ITEM,
        payload:v
    });
}
//全部收起
export const toggleOffAllMenuItem = ()=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_MENU_TOGGLE_OFF_MENU_ITEM,
    });
}
//选中菜单项
export const selectSingleMenuItem = v=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_MENU_SELECT_TABLE_MENU_ITEM,
        payload:v
    })
}
//打开操作栏
export const openOption = v=>{
    return dispatch=>{
        if(v.targetMenu){
            dispatch(GetMount(v));
        }
        dispatch({
            type:Constants.SIDE_BAR_MENU_ITEM_TOGGLE,
            isHasChild:false,
            payload:v
        });
    }
}
//删除操作
export const optionDeleteMenu = v=>{
    if(isOnline){
        return dispatch=>{
            dispatch(AppIsReload(true));
            apiDeleteMenu(v).then(resData=>{
                dispatch(AppIsReload(false));
                return dispatch({
                    type:Constants.APP_DELETE_MENU_ITEM,
                    payload:v
                });
            }).catch(rej=>{
                dispatch(AppIsReload(false));
                return dispatch({
                    type:Constants.CONTENT_SETTING_SETTING_MENU_SEND_ERROR,
                    error:rej
                });
            })
        };
    }else{
        return ({
            type:Constants.APP_DELETE_MENU_ITEM,
            payload:v
        });
    }

}
//发送错误信息
export const actionSendError = (errorMessage)=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_MENU_SEND_ERROR,
        error:errorMessage
    });
}
//错误弹窗点击确定
export const actionIsOk = (okMessage)=>{
    return ({
        type:Constants.CONTENT_SETTING_SETTING_IS_OK,
        ok:okMessage
    });
}
//修改个人信息
export const actionChangeUserInfo = (userID,arg)=>{
    if(isOnline){
        return dispatch=>{
            dispatch(AppIsReload(true));
            apiChangeUserInfo(userID,arg).then(resData=>{
                dispatch(AppIsReload(false));
                dispatch(actionIsOk('修改成功！'));
                dispatch(AppDidMount());
                return dispatch({
                    type:Constants.CONTENT_SETTING_CHANGE_USER_INFO,
                    userInfo:arg,
                });
            }).catch(rejData=>{
                dispatch(AppIsReload(false));
                return dispatch({
                    type:Constants.CONTENT_SETTING_SETTING_MENU_SEND_ERROR,
                    error:rejData
                });
            });
        }
    }else{
        return ({
            type:Constants.CONTENT_SETTING_CHANGE_USER_INFO,
            userInfo:arg,
        });
    }
}
//修改密码
export const actionResetPassWord = (account,userData)=>{
    if(isOnline){
        return dispatch=>{
            dispatch(AppIsReload(true));
            apiResetPassWord(account,userData).then(resData=>{
                dispatch(AppIsReload(false));
                dispatch(actionIsOk('修改成功！'));
                return dispatch({
                    type:Constants.CONTENT_SETTING_RESET_PASS_WORD,
                });
            }).catch(rejData=>{
                dispatch(AppIsReload(false));
                return dispatch({
                    type:Constants.CONTENT_SETTING_SETTING_MENU_SEND_ERROR,
                    error:rejData
                });
            });
        }
    }else{
    }
}
//展开菜单项
export const actionToggleItem=(menuSort, code)=> {
    return ({
        type: Constants.CONTENT_SETTING_QUICK_BUTTON_TABLE_TOGGLE,
        menuSort: menuSort,
        code: code
    });
}
//修改快捷菜单
export const actionChangeQuickButton = (quickButton)=>{
    return ({
        type: Constants.CONTENT_SETTING_CHANGE_QUICK_BUTTON,
        quickButton: quickButton
    });
}
//选择数据字典项
export const actionSelectDataBabelItem = (item)=>{
    if(item){
        return dispatch=>{
            dispatch(AppIsReload(true));
            apiGetDataBabelDetail(item).then(res=>{
                dispatch(AppIsReload(false));
                return dispatch({
                    type: Constants.CONTENT_SETTING_SELECT_DATA_BABEL_ITEM,
                    dataBabelDetail:res,
                    item: item
                });
            }).catch(rej=>{
                dispatch(AppIsReload(false));
                return dispatch(actionSendError(rej));
            });
        }
    }else{
        return ({
            type: Constants.CONTENT_SETTING_SELECT_DATA_BABEL_ITEM,
            item: item
        });
    }
}