import * as Constants from './CONSTANTS';
import {isOnline} from '../config/config';
import {normalTableGetData} from '../services/api';


export const GetMount = (targetID)=>{
    return{
            type:Constants.NORMAL_TABLE_INIT,
            targetID:targetID,
    }
}

export const checkOnItem = (targetID,item)=>{
    return {
        type:Constants.NORMAL_TABLE_CHECK_ON_ITEM,
        targetID:targetID,
        item:item
    }
}
export const onClickButton = (targetID,buttonName)=>{
    if(buttonName){
        return {
            type:Constants.NORMAL_TABLE_ON_CLICK_BUTTON,
            targetID:targetID,
            buttonName:buttonName
        }
    }else{
        return dispatch=>{
            dispatch(saveModifyViewData(targetID,undefined));
            return dispatch({
                type:Constants.NORMAL_TABLE_ON_CLICK_BUTTON,
                targetID:targetID,
                buttonName:buttonName
            })
        }
    }
}

export const submitDeleteData = (targetID,data,api)=>{
    if(isOnline){
        //Todo:表格删除接后台
        return dispatch=>{
            return dispatch({
                type:Constants.NORMAL_TABLE_SUBMIT_DELETE_DATA,
                targetID:targetID,
                data:data
            })
        }
    }else{
        return dispatch=>{
            dispatch(onClickButton(targetID,undefined));
            return dispatch({
                type:Constants.NORMAL_TABLE_SUBMIT_DELETE_DATA,
                targetID:targetID,
                data:data
            });
        }
    }
}

export const submitModifyData = (targetID,data,api)=>{
    if(isOnline){
        //Todo:表格修改接后台
        return dispatch=>{
            return dispatch({
                type:Constants.NORMAL_TABLE_SUBMIT_MODIFY_DATA,
                targetID:targetID,
                data:data
            })
        }
    }else{
        return dispatch=>{
            dispatch(onClickButton(targetID,undefined));
            return dispatch({
                type:Constants.NORMAL_TABLE_SUBMIT_MODIFY_DATA,
                targetID:targetID,
                data:data
            });
        }
    }
}

export const saveModifyViewData = (targetID,modifyViewData)=>{
    return {
        type:Constants.NORMAL_TABLE_SAVE_MODIFY_VIEW_DATA,
        targetID:targetID,
        modifyViewData:modifyViewData
    }
}

export const getData = (targetID,api,...arg)=>{

    return dispatch=>{
        normalTableGetData(api,...arg).then((data)=>{
            return dispatch({
                type:Constants.NORMAL_TABLE_GET_DATA,
                targetID:targetID,
                data:data
            })
        });
    };
}
