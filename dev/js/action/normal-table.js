import * as Constants from './CONSTANTS';
import {AppIsReload} from './app';
import {isOnline} from '../config/config';
import {normalTableGetData, insertTableItem,apiModifyTableItem,apiDeleteTableItem,apiOnClickToggleOptions} from '../services/api';

//标准表格组件初始化
export const GetMount = (targetID,InitTableArgs)=>{
    return{
            type:Constants.NORMAL_TABLE_INIT,
            targetID:targetID,
            initTableArgs:InitTableArgs
    }
}
//选中项
export const checkOnItem = (targetID,item)=>{
    return {
        type:Constants.NORMAL_TABLE_CHECK_ON_ITEM,
        targetID:targetID,
        item:item
    }
}
//点击按钮状态
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

//删除数据
export const submitDeleteData = (targetID,data,api,tableApi,tableArgs)=>{
    if(isOnline){
        //Todo:表格删除接后台
        return dispatch=>{
            dispatch(AppIsReload(true));
            apiDeleteTableItem(api,data).then(resData=>{
                dispatch(AppIsReload(false));
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
                    dispatch(AppIsReload(false));
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
//增加数据
export const submitAddData = (targetID,allData,data,addApi,item,tableApi,tableArgs)=>{
        if(isOnline){
            return dispatch=>{
                dispatch(AppIsReload(true));
                insertTableItem(addApi, item, data).then(apiData=> {
                    dispatch(AppIsReload(false));
                    dispatch(onClickButton(targetID,undefined));
                    return dispatch(getData(targetID,tableApi,tableArgs));
                }).catch(error=> {
                    dispatch(AppIsReload(false));
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

//修改数据
export const submitModifyData = (targetID,data,api)=>{
    if(isOnline){
        return dispatch=>{
            dispatch(AppIsReload(true));
            apiModifyTableItem(api,data).then(resData=>{
                dispatch(AppIsReload(false));
                dispatch(onClickButton(targetID,undefined));
                return dispatch({
                    type:Constants.NORMAL_TABLE_SUBMIT_MODIFY_DATA,
                    targetID:targetID,
                    data:data
                })
            }).catch(rejData=>{
                dispatch(AppIsReload(false));
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
//保存修改遮罩层的数据
export const saveModifyViewData = (targetID,modifyViewData)=>{
    return {
        type:Constants.NORMAL_TABLE_SAVE_MODIFY_VIEW_DATA,
        targetID:targetID,
        modifyViewData:modifyViewData
    }
}
//获取当前表格数据
export const getData = (targetID,api,arg)=>{
    return dispatch=>{
        dispatch(AppIsReload(true));
        normalTableGetData(api,arg).then((data)=>{
            dispatch(AppIsReload(false));
            return dispatch({
                type:Constants.NORMAL_TABLE_GET_DATA,
                targetID:targetID,
                data:data,
                error:undefined
            })
        }).catch(error=>{
            dispatch(AppIsReload(false));
            return dispatch({
                type:Constants.NORMAL_TABLE_GET_DATA,
                targetID:targetID,
                data:undefined,
                error:error
            })
        });
    };
}
//展开收起菜单项
export const actionToggleItem = (targetID,item)=>{
    return {
        type:Constants.NORMAL_TABLE_TOGGLE_ITEM,
        targetID:targetID,
        item:item
    }
}
//操作表格中的开关式按钮
export const actionOnClickToggleOptions = (targetID,api,item,bindField,nowOnState)=>{
    return dispatch=>{
        dispatch(AppIsReload(true));
        apiOnClickToggleOptions(api,item).then(resData=>{
                dispatch(AppIsReload(false));
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
                dispatch(AppIsReload(false));
                return dispatch({
                    type:Constants.NORMAL_TABLE_SUBMIT_TABLE_TOGGLE_OPTION,
                    targetID:targetID,
                    error:rejData,
                });
            }
        );
    };
}
//批量选择项
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
//打开批量操作
export const actionOpenBatchOption = (targetId,isOpen)=>{
    return ({
        type:Constants.NORMAL_TABLE_BATCH_OPTION_IS_OPEN,
        targetID:targetId,
        isOpen:isOpen
    });

}
//控制搜索组组件展开状态
export const actionToggleSearchGroup = (targetID,toggleStatus)=>{
    return ({
        type:Constants.NORMAL_TABLE_TOGGLE_SEARCH_GROUP,
        targetID:targetID,
        toggleStatus:toggleStatus
    });
}
//发送错误信息
export const actionSendError = (targetID,errorMessage)=>{
    return ({
        type:Constants.NORMAL_TABLE_SEND_ERROR,
        targetID:targetID,
        error:errorMessage
    });
}