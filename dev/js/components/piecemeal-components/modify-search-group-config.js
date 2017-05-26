import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Constants from '../../action/CONSTANTS';
/*
*
* 设置通用搜索框
* 暂时废弃
*
* */
class ModifySearchGroupConfig extends React.Component{
    constructor(props){
        super();
        this.state ={
            targetObject:props.targetObject,
            dataHasCreated:props.dataHasCreated?props.dataHasCreated:[],
            onOkCallBack:props.onOk,
            target:props.target,
            allData:props.config,
            tableData:props.tableData
        }
    }

    componentWillMount(){
        let nowBtnGroupData =[];
        if(this.state.allData){
            let key = this.state.allData.key;
            let btnGroupData = this.state.allData.btnGroup
            btnGroupData.map((v,k)=>{
                if(k===key){
                    nowBtnGroupData = v.btnConfig;
                }
            });
        }
        this.props.actionDidMount(this.state.target,nowBtnGroupData);
    }

    componentWillReceiveProps(props){
        this.state ={
            targetObject:props.targetObject,
            dataHasCreated:props.dataHasCreated,
            onOkCallBack:props.onOk,
            target:props.target,
            allData:props.config,
            tableData:props.tableData
        }
    }
    createContent(){
        let createFieldList = ()=> {
            let handleOnClick = (item)=> {
                let dataHasCreated = this.state.dataHasCreated;
                dataHasCreated.push(item);
                this.props.actionSaveDataHasCreated(this.state.target,dataHasCreated);
            }
            return this.state.tableData.map((v, k)=> {
                let flag = true;
                for (let i in this.state.dataHasCreated) {
                    if (this.state.dataHasCreated[i].name === v.name) {
                        flag = false;
                    }
                }
                if (flag) {
                    return (<li onClick={()=>{
                        let singleItem = {
                            name:v.name,
                            CNName: v.CNName,
                            api:''
                        };
                        handleOnClick(singleItem);
                    }
                    } key={k}>{v.name}</li>);
                }
            });
        }

        let createTable = ()=>{
            let createTHead = ()=>{
                return <thead>
                    <tr>
                        <th style={{width:"50px"}}>排序</th>
                        <th>选项字段名</th>
                        <th>赋予中文名</th>
                        <th>赋予API</th>
                        <th style={{width:"50px"}}>删除</th>
                    </tr>
                </thead>
            }
            let createTBody = ()=>{
                let handleOnChange = (key, val, itemKey, itemVal)=> {
                    let singleItem = {
                        name: val.name,
                        CNName: val.CNName,
                        api: val.api
                    };
                    singleItem[itemKey] = itemVal;
                    let newValue = [];
                    newValue = this.state.dataHasCreated.map((v, k)=> {
                        if (k === key) {
                            return singleItem;
                        } else {
                            return v;
                        }
                    });
                    this.props.actionSaveDataHasCreated(this.state.target,newValue);
                }

                let handleDelete = (key)=> {
                    let newValue = [];
                    newValue = this.state.dataHasCreated.filter((v, k)=> {
                        if (!(k === key)) {
                            return v;
                        }
                    });
                    this.props.actionSaveDataHasCreated(this.state.target,newValue);
                }
                let createTr = ()=>{
                   return  this.state.dataHasCreated.map((v,k)=>{
                        return <tr key={k}>
                            <td>
                                <div className="sort">
                                    <div onClick={()=>{
                        let newValue = this.state.dataHasCreated;
                        for(let i=0;i<newValue.length;i++){
                            if(k>0&&k===i){
                                let temp = newValue[i-1];
                                newValue[i-1] =  newValue[i];
                                newValue[i] = temp;
                            }
                        }
                        this.props.actionSaveDataHasCreated(this.state.target,newValue);
                    }
                    } className="up"></div>
                                    <div onClick={()=>{
                        let newValue = this.state.dataHasCreated;
                        for(let i=0;i<newValue.length;i++){
                            if(k<newValue.length-1&&k===i){
                                let temp = newValue[i+1];
                                newValue[i+1] =  newValue[i];
                                newValue[i] = temp;
                            }
                        }
                        this.props.actionSaveDataHasCreated(this.state.target,newValue);}}
                                         className="down"></div>
                                </div>
                            </td>
                            <td>{v.name}</td>
                            <td><input onChange={
                        e=>{
                        handleOnChange(k,v,'CNName',e.target.value);
                        }
                    } value={v.CNName} type="text"/></td>
                            <td><input onChange={
                        e=>{
                         handleOnChange(k,v,'api',e.target.value);
                        }
                    } value={v.api} type="text"/></td>
                            <td><i onClick={()=>{
                            handleDelete(k);
                    }} className="fa fa-times-circle delete"></i></td>
                        </tr>
                    });
                }

                return <tbody>
                {createTr()}
                </tbody>
            }
            return (<table className="standard-table">
                {createTHead()}
                {createTBody()}
            </table> )
        }

        return (<div>
            <div className="field-list">
                <ul>{createFieldList()}</ul>
            </div>
            <div className="content-table">
                {createTable()}
            </div>
        </div>);
    }

    render(){
        if(this.state.allData){
            return (<div className="shield">
                <div style={{width:'90%',left:'5%',height:'90%',top:'5%'}} className="shield-modify">
                    <div className="shield-modify-content-search-group">
                        {this.createContent()}
                    </div>
                    <div className="shield-modify-footer">
                        <button onClick={e=>{
                            this.props.actionCloseThis(this.state.target);
                            e.stopPropagation();
                        }} className="btn">取消</button>
                        <button onClick={
                            ()=>{
                                let key = this.state.allData.key;
                                let btnGroupData = this.state.allData.btnGroup
                                let newBtnGroupData = btnGroupData.map((v,k)=>{
                                    if(k===key){
                                        v.btnConfig = this.state.dataHasCreated;
                                        return v;
                                    }else{
                                        return v
                                    }
                                });
                                this.state.onOkCallBack(newBtnGroupData);
                                this.props.actionCloseThis(this.state.target);
                            }
                        } className="btn btn-finish">完成</button>
                    </div>
                </div>
            </div>)
        }else{
            return (<div></div>);
        }

    }
}

const state = (state)=>{
    let active;
    state.modifySearchGroupConfig.activeContent.map((v, k)=> {
        if (v.target === state.common.nowOnContentTarget.id) {
            active = v;
        }
    });
    return ({
        targetObject:active,
        dataHasCreated:active?active.dataHasCreated:undefined
    });
}

const action = (dispatch)=>{
    let actions = {
        actionDidMount:(target,nowBtnGroupConfig)=>{
            let btnGroupConfig = undefined;
            if(nowBtnGroupConfig&&nowBtnGroupConfig.length>0){
                btnGroupConfig = nowBtnGroupConfig;
            }

            return ({
                type:Constants.MODIFY_SEARCH_GROUP_CONFIG_INIT_STATE,
                target:target,
                btnGroupConfig:btnGroupConfig
            });
        },
        actionCloseThis:(target)=>{
            return dispatch=>{
                dispatch(
                {
                    type:Constants.MENU_SETTING_CHANGE_BUTTON_CONFIG_PREVIEW_STATUS,
                        target:target,
                    nowOnButtonConfig:undefined
                });
                return dispatch({
                    type:Constants.MODIFY_SEARCH_GROUP_CONFIG_INIT_STATE,
                    target:target
                });
            };
        },
        actionSaveDataHasCreated:(target,dataHasCreated)=>{
            return ({
                type:Constants.MODIFY_SEARCH_GROUP_CONFIG_SAVE_DATA_HAS_CREATED,
                target:target,
                dataHasCreated:dataHasCreated
            });
        }


    };
    return bindActionCreators(actions,dispatch);
}

export default connect(state,action)(ModifySearchGroupConfig);