import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Constants from '../../action/CONSTANTS';

import {actionSendError} from '../../action/normal-table';

import classnames from 'classnames';
import {apiFormatModifyShieldFieldDataFromApi} from '../../services/api';
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
//遮罩层操作组件
import CheckBox from './modify-shield-check-box';
import Radio from './modify-shield-radio-box';
import Select from './modify-shield-select-box';
import Timer from './modify-shield-timer-box';
import UEditor from './modify-shield-ueditor-box';
import Upload from './modify-shield-upload-box';
//json
import ComponentType from '../../../jsons/modify-shield-component-type.json';

/*
* @param
* targetID:string 必填 当前显示页面的ID
* isShow:boolean 必填 是否显示本遮罩层，与Redux组件桥接
* fieldData:[] 必填 本组件所包含字段数组
* data:{} 可选 来自菜单的某选中项详细数据
* onChange:() 可选 菜单内修改事件响应回调，用以转传入Redux。
* onCancel:() 可选 关闭遮罩的回调，如没有则不显示取消按钮
* onFinish:() 可选 完成修改的回调，如没有则不显示确定按钮
* */

class ModifyShield extends React.Component{
    constructor(props){
        super();
        this.state={
            data:props.data?props.data:{},
            isShow:props.isShow,
            fieldData: props.fieldData,
            onCancel: props.onCancel,
        }
    }
    componentWillMount() {
        if(this.props.dataFromStore){
            this.setState({
                data:this.props.dataFromStore
            });
        }else{
            this.props.actionDidMount(this.props.targetID,this.props.data);
        }

        apiFormatModifyShieldFieldDataFromApi(this.props.fieldData).then(
            res=> {
                this.setState({
                    loaded:true,
                    fieldData: res,
                });
            }
        ).catch(rej=> {
            console.log(rej)
        });
    }

    createFieldStructure(){
        let createItem = ()=>{
            let handleOnChange = (val,e)=>{
                let newData = this.state.data;
                this.setState({
                    data:newData
                });
                newData[val.name] = e;
                this.props.actionOnChange(this.props.targetID,newData);
            }

            let choiceClassName = (val)=>{
                return classnames({
                    'must-filling':val.isMustFilling,
                    'multiple-item':val.isMultiColumns,
                    'single-item':!val.isMultiColumns
                })
            }
            let createNormalInput = (val,valData)=> {
                return (<input disabled={val.isDisable||this.props.disabled} onChange={(e)=>{
                    if(!val.isDisable){
                        handleOnChange(val,e.target.value);
                    }
                }} style={{width: val.componentWidth + '%'}} value={valData}  type="text"/>);
            }

            let createItemComponent = (val,valData)=> {
                switch (val.componentType) {
                    case 'input':
                        return (createNormalInput(val,valData));
                        break;
                    case 'checkBox':
                        return <CheckBox disabled={this.props.disabled} onChange={
                            e=>{
                                if(!val.isDisable){
                                    handleOnChange(val,e);
                                }
                            }
                        } itemFieldData={val} data={valData}></CheckBox>;
                        break;
                    case 'radio':
                        return <Radio disabled={this.props.disabled} onChange={
                            e=>{
                                if(!val.isDisable){
                                    handleOnChange(val,e);
                                }
                            }
                        } itemFieldData={val} data={valData}></Radio>
                        break;
                    case 'select':
                        return <Select disabled={this.props.disabled} onChange={
                            e=>{
                                if(!val.isDisable){
                                    handleOnChange(val,e);
                                }
                            }
                        } itemFieldData={val} data={valData}></Select>
                        break;
                    case 'timer':
                        return <Timer disabled={this.props.disabled} onChange={
                            e=>{
                                if(!val.isDisable){
                                    handleOnChange(val,e);
                                }
                            }
                        } itemFieldData={val} data={valData}></Timer>
                        break;
                    case 'uEditor':
                        return <UEditor  onChange={
                            e=>{
                                if(!val.isDisable){
                                    handleOnChange(val,e);
                                }
                            }
                        } disabled={val.isDisable||this.props.disabled} targetID={this.props.targetID} itemFieldData={val} data={valData}></UEditor>
                        break;
                    case 'webUpload':
                        return <Upload disabled={val.isDisable||this.props.disabled}  targetID={this.props.targetID} sendError={e=>{
                            this.props.actionSendError(this.props.targetID,e)}} onChange={
                            e=>{
                                if(!val.isDisable){
                                    handleOnChange(val,e);
                                }
                            }
                        } itemFieldData={val} data={valData}></Upload>
                        break;
                }
            }
            return this.state.fieldData.map((val,key)=>{
                let style ={
                    width: (val.width + '%')
                }
                let valData = this.state.data[val.name]?this.state.data[val.name]:'';
                if(val.isEnable){
                    if (!val.isMultiColumns) {
                        //用以清除浮动
                        if (this.state.fieldData[key - 1] && this.state.fieldData[key - 1].isMultiColumns) {
                            return (<div key={key}>
                                <div style={{clear: 'both'}}></div>
                                <li  style={style}
                                    className={choiceClassName(val)}><span >{val.CNName}:</span>{createItemComponent(val,valData)}</li>
                            </div>)
                        } else {
                            return (<li key={key} style={style}
                                        className={choiceClassName(val)}><span>{val.CNName}:</span>{createItemComponent(val,valData)}</li>);
                        }
                    } else {
                        return (<li key={key} style={style}
                                    className={choiceClassName(val)}><span>{val.CNName}:</span>{createItemComponent(val,valData)}</li>);
                    }
                }
            });
        }

        return (<div  className="shield-modify-content">
            <ul>
                {createItem()}
            </ul>
        </div>)
    }

    createFooter() {
        let createCancelButton = ()=> {
            if (this.state.onCancel) {
                return (<button onClick={(e)=> {
                    this.state.onCancel();
                    this.props.actionCloseThis(this.props.targetID);
                    e.stopPropagation();
                }} className="btn">取消</button>);
            }
        }

        let createFinishButton = ()=> {
            if (this.props.onFinish) {
                return (<button onClick={(e)=> {
                this.props.onFinish(this.state.data);
                this.props.actionCloseThis(this.props.targetID);
                 e.stopPropagation();
                }} className="btn btn-finish">确定</button>);
            }
        }

        return (<div className="shield-modify-footer">{createCancelButton()}{createFinishButton()}</div>)
    }


    render(){
        if(this.state.isShow){
            return ( <div onClick={e=> {
                e.stopPropagation();
            }} className="shield">
                <Loader loaded={this.state.loaded} options={LoaderOption}>
                <div key={this.state.data} className="shield-modify">
                        <div className="shield-modify-container">
                            {this.createFieldStructure()}
                        </div>
                        {this.createFooter()}
                </div>
                </Loader>
            </div>)
        }else{
            return (<div></div>);
        }
    }
}

let state = (state)=>{
    let data;
    state.modifyShield.activeContent.map((v, k)=> {
        if (v.target === state.common.nowOnContentTarget.id) {
            data = v.data;
        }
    });
    return ({
        dataFromStore:data
    });
}

let action = (dispatch)=>{
    let actions = {
        actionDidMount:(targetID,initData)=>{
            return ({
                type:Constants.SHIELD_MODIFY_DID_MOUNT,
                targetID:targetID,
                initData:initData
            });
        },
        actionCloseThis:(targetID)=>{
            return ({
                type:Constants.SHIELD_MODIFY_CLOSE_THIS,
                targetID:targetID,
            });
        },
        actionOnChange:(targetID,newData)=>{
            return ({
                type:Constants.SHIELD_MODIFY_ON_CHANGE,
                targetID:targetID,
                data:newData
            });
        },
        actionSendError:(targetID,msg)=>{
           return dispatch(actionSendError(targetID,msg));
        }

    }
    return bindActionCreators(actions,dispatch);
}

export default connect(state,action)(ModifyShield);
