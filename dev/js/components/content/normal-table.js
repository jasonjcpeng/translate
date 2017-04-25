import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
//piecemeal-components
import ButtonGroupModifier from '../piecemeal-components/button-group-modifier';
import ButtonGroupDeleter from '../piecemeal-components/button-group-deleter';
import ButtonGroupAdder from '../piecemeal-components/button-group-adder';
import ShieldAlert from '../piecemeal-components/shield-alert';

import * as ActionCreators from '../../action/normal-table';
import InitTableArgs from '../../../jsons/init-table-args.json';
//全局变量
const constID = 'AX_Id';
const constParentID = 'AX_ParentId';

class NormalTable extends React.Component {
    componentWillMount() {
        if (!this.props.target.status) {
            this.props.GetMount(this.props.targetID,InitTableArgs);
        }
        if (!this.props.loaded) {
            this.props.getData(this.props.targetID, this.props.api,InitTableArgs);
        }
    }

    //根据当前按钮打开相应按钮组件
    judgementOpenButtonGroupComponent() {
        let isShow = this.props.nowOnClickButton ? true : false;
        let api = this.props.nowOnClickButton?this.props.nowOnClickButton.api:'';
        if (this.props.nowOnClickButton) {
            switch (this.props.nowOnClickButton.componentName) {
                case 'add':
                    return (<ButtonGroupAdder isShow={isShow} reduxSaveData={this.props.modifyViewData} fieldData={this.props.modifyViewPoint}
                                                 onCancel={e=>{
                    this.props.onClickButton(this.props.targetID,undefined);
                }} onChange={
                    data=>{
                    this.props.saveModifyViewData(this.props.targetID,data);
                    }}
                                                 onFinish={
                        data=>{
                            this.props.submitAddData(this.props.targetID,this.props.data,data,api,this.props.nowOnItem,this.props.api,this.props.tableConfigArgs);
                        }
                    }
                    ></ButtonGroupAdder>);
                    break;
                case 'check':
                    return <ButtonGroupModifier isShow={isShow} reduxSaveData={this.props.modifyViewData}
                                                initData={this.props.nowOnItem} fieldData={this.props.modifyViewPoint}
                                                onCancel={e=>{
                    this.props.onClickButton(this.props.targetID,undefined);
                }}
                    ></ButtonGroupModifier>
                    break;
                case 'modify':
                    return (<ButtonGroupModifier isShow={isShow} reduxSaveData={this.props.modifyViewData}
                                                 initData={this.props.nowOnItem} fieldData={this.props.modifyViewPoint}
                                                 onCancel={e=>{
                    this.props.onClickButton(this.props.targetID,undefined);
                }} onChange={
                    data=>{
                    this.props.saveModifyViewData(this.props.targetID,data);
                    }}
                                                 onFinish={
                        data=>{
                        this.props.submitModifyData(this.props.targetID,data,api);
                        }
                    }
                    ></ButtonGroupModifier>);
                    break;
                case 'delete':
                    return <ButtonGroupDeleter isShow={isShow} deleteFunc={()=>{
                    this.props.submitDeleteData(this.props.targetID,this.props.nowOnItem,api);
                    }
                    }></ButtonGroupDeleter>;
                    break;
            }
        }
    }

    //创造选项按钮组
    createOptionBar() {
        let mapButton = ()=> {
            let createLiClassName = (v, k)=> {
                return classnames({
                    'first-child': k === 0,
                    'active': this.props.nowOnClickButton === v
                });
            }


            let isToggleGroup = [];
            let isNotToggleGroup = [];
            this.props.btnGroup.map((v)=> {
                if (v.isToggleGroup) {
                    isToggleGroup.push(v);
                } else {
                    isNotToggleGroup.push(v);
                }
            });

            if (this.props.nowOnItem) {
                return isToggleGroup.map((v, k)=> {
                    return (<li onClick={
                        e=>{
                        this.props.onClickButton(this.props.targetID,v);
                        e.stopPropagation();
                        }
                        } key={k} className={createLiClassName(v,k)}>{v.CNName}</li>);
                });
            } else {
                return isNotToggleGroup.map((v, k)=> {
                    return (<li
                        onClick={
                        e=>{
                        this.props.onClickButton(this.props.targetID,v);
                        e.stopPropagation();
                        }
                        } key={k} className={createLiClassName(v,k)}>{v.CNName}</li>);
                });
            }
        }
        return (<div className="normal-table-header">
            <div key={(()=>{return this.props.nowOnItem?'undefined':'onItem'})()}
                 className="animation-fadeInRight animation-fadeIn component-option-bar">
                <ul>
                    {mapButton()}
                </ul>
            </div>
        </div>)
    }

    //创造表格
    createTable() {
        //表单头
        let createTableHead = ()=> {
            let mapTh = ()=> {
                let styleWidth = (width)=> {
                    return {width: width ? width + '%' : ''};
                }
                return this.props.viewPoint.map((v, k)=> {
                    if (v.isEnable) {
                        return <th style={{width:v.width+'%'}} key={k}>{v.CNName}</th>;
                    }
                })
            }
            if(this.props.data){
                if(this.props.data[0]&&this.props.data[0][constParentID]){
                    return (<thead>
                    <tr>
                        <th style={{borderRight:'0'}}></th>
                        {mapTh()}</tr>
                    </thead>)
                }else{
                    return (<thead>
                    <tr>
                        <th style={{width:'20px',borderLeft:'0'}}></th>
                        {mapTh()}</tr>
                    </thead>)
                }
            }
        }
        let createTableBody = ()=> {
            let mapTd = (val)=> {
                return this.props.viewPoint.map((v, k)=> {
                    if (v.isEnable) {
                        return (<td key={k}>{val[v.name]?val[v.name]:''}</td>);
                    }
                })
            }

            let createTrClassName = (v)=> {
                if (v === this.props.nowOnItem) {
                    return 'active';
                }
            }

            let  isMenuHasChild =(newMenu, currentMenu)=>{
                for (let i in newMenu) {
                    if (newMenu[i][constParentID] === currentMenu[constID]) {
                        return true;
                        break;
                    }
                }
                return false;
            }
            let trIsHidden = (v)=>{
                let toggleStateFlag = true;
                if(v[constParentID]==='0'){
                    toggleStateFlag = false;
                }else{
                    for(let i in this.props.toggleItem){
                        if(v[constParentID]===this.props.toggleItem[i][constID]){
                            toggleStateFlag = false;
                        }
                    }
                }
                return toggleStateFlag;
            }
            let arrowIconMargin = (v,margin)=>{
                let localMargin = margin;
                    for(let i=0;i<this.props.data.length;i++){
                        if(v[constParentID]===this.props.data[i][constID]){
                            localMargin += arrowIconMargin(this.props.data[i],(margin+5));
                        }
                    }
                return localMargin
            }
            let trToggleIconClassNames = (v)=>{
                let toggleStateFlag = false;
                for(let i in this.props.toggleItem){
                    if(v[constID]===this.props.toggleItem[i][constID]){
                        toggleStateFlag = true;
                    }
                }
                return toggleStateFlag?'menu-toggle fa fa-caret-down':'menu-toggle fa fa-caret-right';
            }
            let quickSort  = (arr, root={AX_Id:'0'}, result=[])=>{
                let menu = [];
                if (arr.length > 0) {
                    let newArr = arr.filter(v=> {
                        if (v[constParentID] === root[constID]) {
                            menu.push(v);
                        } else {
                            return v;
                        }
                    });
                    if (menu.length > 0) {
                        for (let i in menu) {
                            result.push(menu[i]);
                            quickSort(newArr, menu[i], result);
                        }
                    }
                }
                return result;
            }
            //分别渲染级联型表或非级联型表
            if(this.props.data){
                let menuData =  this.props.data;
                if(this.props.data[0]&&this.props.data[0][constParentID]){
                    menuData = quickSort(this.props.data);
                    return <tbody>{menuData.map((v, k)=> {
                        return (<tr hidden={trIsHidden(v)} className={createTrClassName(v)} onClick={(e)=>{
                            this.props.checkOnItem(this.props.targetID,v);
                            e.stopPropagation();
                        }} key={k}>
                            <td>{ (()=>{
                                return (<div style={{width:'40px',float:'left',paddingLeft:arrowIconMargin(v,5)+'px'}}>
                                    {(()=>{
                                        if (isMenuHasChild(menuData, v)) {
                                            return (<i onClick={
                                                e=>{
                                                    this.props.actionToggleItem(this.props.targetID,v);
                                                    e.stopPropagation();
                                                }
                                            } className={trToggleIconClassNames(v)}></i>)
                                        }else{
                                            return (<i  className="menu-no-toggle"></i>)
                                        }
                                    })()}
                                    <span style={{marginLeft:'5px'}}>{k + 1}</span>
                                </div>);
                            })()}</td>
                            {mapTd(v)}
                        </tr>);
                    })}</tbody>
                }else{
                    return <tbody>{menuData.map((v, k)=> {
                        return (<tr hidden={false} className={createTrClassName(v)} onClick={(e)=>{
                            this.props.checkOnItem(this.props.targetID,v);
                            e.stopPropagation();
                        }} key={k}>
                            <td>{k + 1}</td>
                            {mapTd(v)}
                        </tr>);
                    })}</tbody>
                }
            }
        }

        return (<div style={{height:this.props.height-150}} className="normal-table-content">
            <table style={{width:'95%',margin:'0 auto'}}>
                {createTableHead()}
                {createTableBody()}
            </table>
        </div>);
    }


    renderPC() {
        let height = this.props.height;
        return (
            <div  className="content-container animation-fadeInRight">
                <ShieldAlert key={this.props.targetID+''+this.props.error} content={this.props.error} title={'警告'} onTargetMenuTarget={this.props.targetID}></ShieldAlert>
                    <div onClick={
                    ()=>{
                            if(this.props.nowOnItem){
                                this.props.checkOnItem(this.props.targetID,undefined);
                            }
                        }
                }  className="content-container-inset" style={{height: height}}>
                        {this.judgementOpenButtonGroupComponent()}
                        <Loader options={LoaderOption} loaded={this.props.loaded}>
                        <div style={{minWidth: 600, height: '100%'}}>
                            {this.createOptionBar()}
                            {this.createTable()}
                        </div>
                        </Loader>
                    </div>

            </div>
        );

    }

    render() {
        switch (this.props.defaultToggleStatus) {
            case 'none':
                return (<div className="normal-table"></div>);
                break;
        }
        return <div  className="normal-table">{this.renderPC()}</div>;

    }
}


const state = state=> {
    let loaded, target, btnGroup, viewPoint, modifyViewPoint, targetID, api, data, nowOnItem, nowOnClickButton,
        modifyViewData,toggleItem,tableConfigArgs,pageNation,error;
    state.containerTitleMenu.activeContent.map(v=> {
        if (v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
        }
    });
    targetID = target.obj.id ? target.obj.id : '';
    api = target.obj.api ? target.obj.api : '';
    btnGroup = target.obj.btnGroup ? target.obj.btnGroup : [];
    viewPoint = target.obj.viewPoint ? target.obj.viewPoint : [];
    modifyViewPoint = target.obj.modifyViewPoint ? target.obj.modifyViewPoint : [];
    data = target.status? target.status.data : [];
    nowOnItem = target.status ? target.status.checkOnItem : undefined;
    nowOnClickButton = target.status ? target.status.nowOnClickButton : undefined;
    modifyViewData = target.status ? target.status.modifyViewData : undefined;
    loaded = target.status ? target.status.loaded : false;
    toggleItem=target.status ? target.status.toggleItem : [];
    tableConfigArgs = target.status ? target.status.tableConfigArgs : undefined;
    error = target.status ? target.status.error: undefined;
    return ({
        target: target,
        //读取状态
        loaded: loaded,
        //btnGroup 按钮组
        btnGroup: btnGroup,
        //viewPoint 表格字段
        viewPoint: viewPoint,
        //modifyViewPoint 遮罩层字段
        modifyViewPoint: modifyViewPoint,
        //本页面的头信息ID
        targetID: targetID,
        //本页面关联的获取数据的api
        api: api,
        //根据API获取的表格数据
        data: data,
        //当前选中的项
        nowOnItem: nowOnItem,
        //当前选中的按钮
        nowOnClickButton: nowOnClickButton,
        //当前模态框中数据
        modifyViewData: modifyViewData,
        //当前折叠展开状态的折叠窗：
        toggleItem:toggleItem,
        //当前表格的Api请求参数。决定表格呈现方式，以及排序的字段依据、排序方式等选项
        tableConfigArgs:tableConfigArgs,
        //当前错误信息
        error:error
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(state, action)(NormalTable);
