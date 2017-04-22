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

//btn_delete
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
//btn_add
export const submitAddData = (targetID,allData,data,api,item)=>{
        if(isOnline){
            //Todo:表格附加增加接后台
            return dispatch=>{
                return dispatch({
                    type:Constants.NORMAL_TABLE_SUBMIT_ADD_DATA,
                    targetID:targetID,
                    data:data,
                    item:item
                })
            }
        }else{
            let newData ={};
            let count = allData.length;
            for(let i in data){
                if(i!=='AX_Id'&&i!=='AX_ParentId'){
                    newData[i]=data[i]
                }
            }
            newData['AX_Id']=++count;
            if(item){
                newData['AX_ParentId']=item['AX_Id'];
            }else{
                newData['AX_ParentId']="0";
            }
            return dispatch=>{
                dispatch(onClickButton(targetID,undefined));
                return dispatch({
                    type:Constants.NORMAL_TABLE_SUBMIT_ADD_DATA,
                    targetID:targetID,
                    data:newData,
                    item:item
                })
            }
        }
}

//btn_modify
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

export const actionToggleItem = (targetID,item)=>{
    return {
        type:Constants.NORMAL_TABLE_TOGGLE_ITEM,
        targetID:targetID,
        item:item
    }
}

