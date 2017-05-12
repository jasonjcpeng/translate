import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
//piecemeal-components
import ButtonGroupModifier from '../piecemeal-components/button-group-modifier';
import ButtonGroupDeleter from '../piecemeal-components/button-group-deleter';
import ButtonGroupBatchDeleter from '../piecemeal-components/button-group-batch-deleter';
import ButtonGroupAdder from '../piecemeal-components/button-group-adder';
import ButtonGroupRoleAuthorize from '../piecemeal-components/button-group-role-authorize';
import Pagination from '../piecemeal-components/pagination';
import ShieldAlert from '../piecemeal-components/shield-alert';
import Checker from '../piecemeal-components/checker';
//Tool
import {FormatDataInfo} from '../../config/tools';

import * as ActionCreators from '../../action/normal-table';
import InitTableArgs from '../../../jsons/init-table-args.json';
//全局变量
import {constID, constParentID} from '../../config/config';

class NormalTable extends React.Component {
    componentWillMount() {
        if (!this.props.target.status) {
            this.props.GetMount(this.props.targetID, InitTableArgs);
        }
        if (!this.props.loaded) {
            this.props.getData(this.props.targetID, this.props.api, InitTableArgs);
        }
    }

    //根据当前按钮打开相应按钮组件
    judgementOpenButtonGroupComponent() {
        let isShow = this.props.nowOnClickButton ? true : false;
        let api = this.props.nowOnClickButton ? this.props.nowOnClickButton.api : '';
        if (this.props.nowOnClickButton) {
            switch (this.props.nowOnClickButton.componentName) {
                case 'add':
                    return (<ButtonGroupAdder isShow={isShow} reduxSaveData={this.props.modifyViewData}
                                              fieldData={this.props.modifyViewPoint}
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
                case 'batchDelete':
                    if(this.props.batchOnItem.length>0){
                        return <ButtonGroupBatchDeleter isShow={isShow} deleteFunc={()=>{
                            this.props.submitDeleteData(this.props.targetID,this.props.batchOnItem,api,this.props.api,this.props.tableConfigArgs);
                        }}></ButtonGroupBatchDeleter>;
                    }else{
                        this.props.onClickButton(this.props.targetID,undefined);
                    }
                    break;
                case 'roleAuthorize':
                    let roleAuthorizeIsShow = this.props.batchOnItem.length > 0 ? true : false;
                    return <ButtonGroupRoleAuthorize targetID={this.props.targetID}
                        selectedItem={this.props.nowOnItem}
                        isShow={roleAuthorizeIsShow} key={this.props.targetID}></ButtonGroupRoleAuthorize>
                    break;
            }
        }
    }

    //创造选项按钮组
    createOptionBar() {
        let searchGroup = [];
        let mapButton = ()=> {
            let createLiClassName = (v, k)=> {
                return classnames({
                    'first-child': k === 0,
                    'active': this.props.nowOnClickButton === v
                });
            }
            let isToggleGroup = [];
            let isNotToggleGroup = [];
            let isBatchToggleGroup = [];
            this.props.btnGroup.map((v)=> {
                switch (v.isToggleGroup) {
                    case -1:
                        isNotToggleGroup.push(v);
                        break;
                    case 0:
                        isNotToggleGroup.push(v);
                        break;
                    case 1:
                        isToggleGroup.push(v);
                        break;
                    case 2:
                        this.isHasBatchToggle = true;
                        isBatchToggleGroup.push(v);
                        break;
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
            } else if (this.props.isBatchOptionOpen) {
                return isBatchToggleGroup.map((v, k)=> {
                    return (<li onClick={
                        e=>{
                            this.props.onClickButton(this.props.targetID,v);
                            e.stopPropagation();
                        }
                    } key={k} className={createLiClassName(v,k)}>{v.CNName}</li>);
                });
            } else {
                let isNotToggleButtonGroup = isNotToggleGroup.filter(v=>{
                    if(v.isToggleGroup<0){
                        searchGroup.push(v);
                    }else{
                        return v;
                    }
                });
                if(this.isHasBatchToggle){
                    isNotToggleButtonGroup.unshift({componentName:'batchOption',CNName:'批量操作'});
                }

                let mapResultIsNotToggleButtonGroup = isNotToggleButtonGroup.map((v, k)=> {
                    if(v.isToggleGroup<0){
                        searchGroup.push(v);
                    }else{
                        return (<li
                            onClick={
                                e=>{
                                    if(v.componentName==='batchOption'){
                                        this.props.actionOpenBatchOption(this.props.targetID,true);
                                    }else{
                                        this.props.onClickButton(this.props.targetID,v);
                                    }
                                    e.stopPropagation();
                                }
                            } key={k} className={createLiClassName(v,k)}>{v.CNName}</li>);
                    }
                });
                return mapResultIsNotToggleButtonGroup;
            }
        }

        let createSearchGroup = ()=>{
            let mapSearchGroup = ()=>{
                return searchGroup.map((v,k)=>{
                    if(v.componentName==='timeSearch'){
                       return <li className={'select'+(k === 0?' first-child':'')}
                            key={k} ><input type="date"/><span>至</span><input type="date"/></li>
                    }else{
                        return <li className={'select'+(k === 0?' first-child':'')}
                                   key={k} ><select selected={''}>
                            <option value={''}>{v.CNName}</option></select></li>
                    }

                });
            }
            if(searchGroup.length>0){
                return (<ul className="search-group" style={{float:'right',marginRight:'3%'}}>
                    {mapSearchGroup()}
                    <li><input type="text" placeholder="在此输入查询内容"/></li>
                    <li className="search-btn">查询</li>
                </ul> );
            }
        }

        return (<div className="normal-table-header">
            <div key={(()=>{return (this.props.nowOnItem?1:0)+this.props.isBatchOptionOpen})()}
                 className="animation-fadeInRight animation-fadeIn component-option-bar">
                <ul style={{float:'left'}}>
                    {mapButton()}
                </ul>
                {createSearchGroup()}
            </div>
        </div>)
    }

    //创造表格
    createTable() {
        //创造批量选择头
        let createBatchSelect = ()=> {
            let value = (()=> {
                return (this.props.data.length > 0) && (this.props.data.length === this.props.batchOnItem.length) ? true : false;
            })();

            if (this.props.isBatchOptionOpen) {
                let className = classnames({
                    "checkbox": true,
                    'checkbox-checked': value
                });
                return (<th style={{width:30}}>
                    <div onClick={e=>{
                    this.props.actionBatchSelectItem(this.props.targetID,this.props.data);
                    e.stopPropagation();
                }} className={className}></div>
                </th> );
            }

        }

        //表单头
        let createTableHead = ()=> {
            let mapTh = ()=> {
                let styleWidth = (width)=> {
                    return {width: width ? width + '%' : ''};
                }

                return this.props.viewPoint.map((v, k)=> {
                    let className = classnames({
                        'sort-active': this.props.tableConfigArgs && (this.props.tableConfigArgs.sidx === v.name||this.props.tableConfigArgs.sidx === v.bindField)
                    });
                    let createUpClassName = ()=> {
                        let upClassName = classnames({
                            'up': true,
                            'up-active': (()=> {
                                if (this.props.tableConfigArgs && (this.props.tableConfigArgs.sidx === v.name||this.props.tableConfigArgs.sidx === v.bindField)) {
                                    if (this.props.tableConfigArgs.sord === 'ASC') {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            })(),
                        });
                        return upClassName;
                    }
                    let createDownClassName = ()=> {
                        let downClassName = classnames({
                            'down': true,
                            'down-active': (()=> {
                                if (this.props.tableConfigArgs && (this.props.tableConfigArgs.sidx === v.name||this.props.tableConfigArgs.sidx === v.bindField)) {
                                    if (this.props.tableConfigArgs.sord === 'DESC') {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            })(),
                        });
                        return downClassName;
                    }
                    if (v.isEnable) {
                        return <th className={className} style={{width:v.width+'%'}} key={k}>{v.CNName}
                            <div className="sort">
                                <div onClick={e=>{
                                let sidx = '';
                                 let pagination = this.props.tableConfigArgs;
                                 if(!v.name||v.name==='开关式操作器'){
                                    sidx = v.bindField;
                                 }else{
                                     sidx = v.name;
                                 }
                                 pagination.sidx=sidx;
                                pagination.sord='ASC';
                                this.props.getData(this.props.targetID,this.props.api,pagination);
                                e.stopPropagation();
                            }} className={createUpClassName()}></div>
                                <div onClick={e=>{
                                 let sidx = '';
                                 let pagination = this.props.tableConfigArgs;
                                 if(!v.name||v.name==='开关式操作器'){
                                    sidx = v.bindField;
                                 }else{
                                     sidx = v.name;
                                 }
                                 pagination.sidx=sidx;
                                 pagination.sord='DESC';
                                 this.props.getData(this.props.targetID,this.props.api,pagination);
                                e.stopPropagation();
                            }} className={createDownClassName()}></div>
                            </div>
                        </th>;
                    }
                })
            }
            if (this.props.data) {
                if (this.props.data[0] && this.props.data[0][constParentID]) {
                    return (<thead>
                    <tr>
                        {createBatchSelect()}
                        <th style={{borderRight:'0'}}></th>
                        {mapTh()}</tr>
                    </thead>)
                } else {
                    return (<thead>
                    <tr>
                        {createBatchSelect()}
                        <th style={{width:'20px',borderLeft:'0'}}></th>
                        {mapTh()}</tr>
                    </thead>)
                }
            }
        }

        let createTableBody = ()=> {
            //创造批量选择框
            let createBatchSelect = (v)=> {
                let value = (()=> {
                    let result = false;
                    this.props.batchOnItem.map(val=> {
                        if (v[constID] === val[constID]) {
                            return result = true;
                        }
                    });
                    return result
                })();
                if (this.props.isBatchOptionOpen) {
                    let className = classnames({
                        "checkbox": true,
                        'checkbox-checked': value
                    });
                    return (<td>
                        <div onClick={e=>{
                        this.props.actionBatchSelectItem(this.props.targetID,v);
                        e.stopPropagation();
                    }} className={className}></div>
                    </td> );
                }
            }
            let mapTd = (val)=> {
                return this.props.viewPoint.map((v, k)=> {
                    if (v.isEnable) {
                        if (v.api) {
                            return createOptionsInTD(val, v, k);
                        }else if(v.name.indexOf('Time')>0){
                            return (<td key={k}>{val[v.name] ? FormatDataInfo(val[v.name]): ''}</td>);
                        } else {
                            return (<td key={k}>{val[v.name] ? val[v.name] : ''}</td>);
                        }
                    }
                })
            }
            let createOptionsInTD = (val, viewPointVal, k)=> {
                if (val[viewPointVal.bindField] !== undefined) {
                    return (
                        <td key={k}><Checker key={val[viewPointVal.bindField]} checkState={val[viewPointVal.bindField]}
                                             funcOnClick={e=>{
                        this.props.actionOnClickToggleOptions(this.props.targetID,viewPointVal.api,val,viewPointVal.bindField,e);
                    }}></Checker></td>);
                } else {
                    return (<td key={k}></td>)
                }
            }

            let createTrClassName = (v)=> {
                if (v === this.props.nowOnItem) {
                    return 'active';
                }
            }

            let isMenuHasChild = (newMenu, currentMenu)=> {
                for (let i in newMenu) {
                    if (newMenu[i][constParentID] === currentMenu[constID]) {
                        return true;
                        break;
                    }
                }
                return false;
            }
            let trIsHidden = (v)=> {
                let toggleStateFlag = true;
                if (v[constParentID] === '0') {
                    toggleStateFlag = false;
                } else {
                    for (let i in this.props.toggleItem) {
                        if (v[constParentID] === this.props.toggleItem[i][constID]) {
                            toggleStateFlag = false;
                        }
                    }
                }
                return toggleStateFlag;
            }
            let arrowIconMargin = (v, margin)=> {
                let localMargin = margin;
                for (let i = 0; i < this.props.data.length; i++) {
                    if (v[constParentID] === this.props.data[i][constID]) {
                        localMargin += arrowIconMargin(this.props.data[i], (margin + 5));
                    }
                }
                return localMargin
            }
            let trToggleIconClassNames = (v)=> {
                let toggleStateFlag = false;
                for (let i in this.props.toggleItem) {
                    if (v[constID] === this.props.toggleItem[i][constID]) {
                        toggleStateFlag = true;
                    }
                }
                return toggleStateFlag ? 'menu-toggle fa fa-caret-down' : 'menu-toggle fa fa-caret-right';
            }
            let quickSort = (arr, root = {AX_Id: '0'}, result = [])=> {
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
            if (this.props.data) {
                let menuData = this.props.data;
                if (this.props.data[0] && this.props.data[0][constParentID]) {
                    menuData = quickSort(this.props.data);
                    return <tbody>{menuData.map((v, k)=> {
                        return (<tr hidden={trIsHidden(v)} className={createTrClassName(v)} onClick={(e)=>{
                            this.props.checkOnItem(this.props.targetID,v);
                            e.stopPropagation();
                        }} key={k}>
                            {createBatchSelect(v)}
                            <td>{ (()=> {
                                return (<div style={{width:'40px',float:'left',paddingLeft:arrowIconMargin(v,15)+'px'}}>
                                    {(()=> {
                                        if (isMenuHasChild(menuData, v)) {
                                            return (<i style={{float:'left'}} onClick={
                                                e=>{
                                                    this.props.actionToggleItem(this.props.targetID,v);
                                                    e.stopPropagation();
                                                }
                                            } className={trToggleIconClassNames(v)}></i>)
                                        } else {
                                            return (<i className="menu-no-toggle"></i>)
                                        }
                                    })()}
                                    <span style={{marginLeft:'5px'}}>{k + 1}</span>
                                </div>);
                            })()}</td>
                            {mapTd(v)}
                        </tr>);
                    })}</tbody>
                } else {
                    return <tbody>{menuData.map((v, k)=> {
                        return (<tr hidden={false} className={createTrClassName(v)} onClick={(e)=>{
                            this.props.checkOnItem(this.props.targetID,v);
                            e.stopPropagation();
                        }} key={k}>
                            {createBatchSelect(v)}
                            <td>{k + 1}</td>
                            {mapTd(v)}
                        </tr>);
                    })}</tbody>
                }
            }
        }

        return (<div style={{height: this.props.height - 150}} className="normal-table-content">
            <table
                key={(this.props.tableConfigArgs?this.props.tableConfigArgs.page:'')+''+(this.props.tableConfigArgs?this.props.tableConfigArgs.rows:'')}
                className="animation-fadeIn" style={{width:'95%',margin:'0 auto'}}>
                {createTableHead()}
                {createTableBody()}
            </table>
        </div>);
    }

    //创造底栏
    createFooter() {
        return (<div className="normal-table-footer">
            <Pagination api={this.props.api} targetID={this.props.targetID}
                        key={(this.props.tableConfigArgs?this.props.tableConfigArgs.page:'')+'pager'+(this.props.tableConfigArgs?this.props.tableConfigArgs.rows:'')}
                        data={this.props.data} pagination={this.props.tableConfigArgs}></Pagination>
        </div>)
    }

    renderPC() {
        let height = this.props.height;
        return (
            <div className="content-container animation-fadeInRight">
                {this.judgementOpenButtonGroupComponent()}
                <ShieldAlert key={this.props.targetID+''+this.props.error} content={this.props.error} title={'Alert'}
                             onTargetMenuTarget={this.props.targetID}></ShieldAlert>
                <div onClick={
                    ()=>{
                            if(this.props.nowOnItem){
                                this.props.checkOnItem(this.props.targetID,undefined);
                            }else if(this.props.isBatchOptionOpen){
                                this.props.actionOpenBatchOption(this.props.targetID,false);
                            }
                        }
                    } className="content-container-inset" style={{height: height - 30}}>
                    <Loader options={LoaderOption} loaded={this.props.loaded}>
                        <div style={{minWidth: 600, height: '100%'}}>
                            {this.createOptionBar()}
                            {this.createTable()}
                            {this.createFooter()}
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
        return <div className="normal-table">{this.renderPC()}</div>;

    }
}


const state = state=> {
    let loaded, target, btnGroup, viewPoint, modifyViewPoint, targetID, api, data, nowOnItem, nowOnClickButton,
        modifyViewData, toggleItem, tableConfigArgs, error, batchOnItem,isBatchOptionOpen;
    state.containerTitleMenu.activeContent.map(v=> {
        if (state.common.nowOnContentTarget && v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
        }
    });
    targetID = target ? target.obj.id : '';
    api = target ? target.obj.api : '';
    btnGroup = target ? target.obj.btnGroup : [];
    viewPoint = target ? target.obj.viewPoint : [];
    modifyViewPoint = target ? target.obj.modifyViewPoint : [];
    data = target && target.status ? target.status.data : [];
    nowOnItem = target && target.status ? target.status.checkOnItem : undefined;
    nowOnClickButton = target && target.status ? target.status.nowOnClickButton : undefined;
    isBatchOptionOpen = target && target.status ? target.status.isBatchOptionOpen : false;
    modifyViewData = target && target.status ? target.status.modifyViewData : undefined;
    loaded = target && target.status ? target.status.loaded : false;
    toggleItem = target && target.status ? target.status.toggleItem : [];
    tableConfigArgs = target && target.status ? target.status.tableConfigArgs : undefined;
    error = target && target.status ? target.status.error : undefined;
    batchOnItem = target && target.status ? target.status.batchOnItem : [];
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
        //当前批量选中项
        batchOnItem: batchOnItem,
        //当前选中的按钮
        nowOnClickButton: nowOnClickButton,
        //当前批量操作功能是否打开
        isBatchOptionOpen:isBatchOptionOpen,
        //当前模态框中数据
        modifyViewData: modifyViewData,
        //当前折叠展开状态的折叠窗：
        toggleItem: toggleItem,
        //当前表格的Api请求参数。决定表格呈现方式，以及排序的字段依据、排序方式等选项
        tableConfigArgs: tableConfigArgs,
        //当前错误信息
        error: error
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(state, action)(NormalTable);
