import * as Constants from './CONSTANTS';
import {isOnline} from '../config/config';
import {normalTableGetData, insertTableItem,apiModifyTableItem,apiDeleteTableItem,apiOnClickToggleOptions} from '../services/api';


export const GetMount = (targetID,InitTableArgs)=>{
    return{
            type:Constants.NORMAL_TABLE_INIT,
            targetID:targetID,
            initTableArgs:InitTableArgs
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
export const submitDeleteData = (targetID,data,api,tableApi,tableArgs)=>{
    if(isOnline){
        //Todo:表格删除接后台
        return dispatch=>{
            apiDeleteTableItem(api,data).then(resData=>{
                dispatch(onClickButton(targetID,undefined));
                if(Object.prototype.toString.call(data)==='[object Array]'){
                    dispatch(getData(targetID,tableApi,tableArgs));
                    return dispatch({
                        type:Constants.NORMAL_TABLE_SUBMIT_DELETE_DATA,
                        targetID:targetID,
                        data:data,
                        error:undefined
                    })
                }else{
                    return dispatch({
                        type:Constants.NORMAL_TABLE_SUBMIT_DELETE_DATA,
                        targetID:targetID,
                        data:data,
                        error:undefined
                    })
                }
            }).catch(rejData=>{
                dispatch(onClickButton(targetID,undefined));
                return dispatch({
                    type:Constants.NORMAL_TABLE_SUBMIT_DELETE_DATA,
                    targetID:targetID,
                    data:undefined,
                    error:rejData
                })
            });
        }
    }else{
        return dispatch=>{
            dispatch(onClickButton(targetID,undefined));
            return dispatch({
                type:Constants.NORMAL_TABLE_SUBMIT_DELETE_DATA,
                targetID:targetID,
                data:data,
                error:undefined
            });
        }
    }
}
//btn_add
export const submitAddData = (targetID,allData,data,addApi,item,tableApi,tableArgs)=>{
        if(isOnline){
            //Todo:表格附加增加接后台
            return dispatch=>{
                insertTableItem(addApi, item, data).then(apiData=> {
                    dispatch(onClickButton(targetID,undefined));
                    return dispatch(getData(targetID,tableApi,tableArgs));
                }).catch(error=> {
                    console.log(error);
                    return dispatch({
                        type: Constants.NORMAL_TABLE_SUBMIT_ADD_DATA,
                        targetID: targetID,
                        data: data,
                        item: item,
                        error:error
                    })
                });
            }
        }else{
            let newData ={};
            let count = allData.length;
            for(let i in data){
                    newData[i]=data[i]
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
                    item:item,
                    error:undefined
                })
            }
        }
}

//btn_modify
export const submitModifyData = (targetID,data,api)=>{
    if(isOnline){
        return dispatch=>{
            apiModifyTableItem(api,data).then(resData=>{
                dispatch(onClickButton(targetID,undefined));
                return dispatch({
                    type:Constants.NORMAL_TABLE_SUBMIT_MODIFY_DATA,
                    targetID:targetID,
                    data:data
                })
            }).catch(rejData=>{
                console.log(rejData)
            });
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

export const getData = (targetID,api,arg)=>{
    return dispatch=>{
        normalTableGetData(api,arg).then((data)=>{
            return dispatch({
                type:Constants.NORMAL_TABLE_GET_DATA,
                targetID:targetID,
                data:data,
                error:undefined
            })
        }).catch(error=>{
            return dispatch({
                type:Constants.NORMAL_TABLE_GET_DATA,
                targetID:targetID,
                data:undefined,
                error:error
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

export const actionOnClickToggleOptions = (targetID,api,item,bindField,nowOnState)=>{
    return dispatch=>{
        apiOnClickToggleOptions(api,item).then(resData=>{
                return dispatch({
                    type:Constants.NORMAL_TABLE_SUBMIT_TABLE_TOGGLE_OPTION,
                    error:undefined,
                    targetID:targetID,
                    item:item,
                    bindField:bindField,
                    nowOnState:nowOnState
                });
        }
        ).catch(
            rejData=>{
                return dispatch({
                    type:Constants.NORMAL_TABLE_SUBMIT_TABLE_TOGGLE_OPTION,
                    targetID:targetID,
                    error:rejData,
                });
            }
        );
    };
}

export const actionBatchSelectItem = (targetID,data)=>{
    if(Object.prototype.toString.apply(data)==='[object Object]'){
        data = [data];
    }
    return ({
        type:Constants.NORMAL_TABLE_BATCH_SELECT_ITEM,
        targetID:targetID,
        onBatchItem:data
    });

}
