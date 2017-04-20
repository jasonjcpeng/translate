import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
//piecemeal-components
import ButtonGroupModifier from '../piecemeal-components/button-group-modifier';
import ButtonGroupDeleter from '../piecemeal-components/button-group-deleter';

import * as ActionCreators from '../../action/normal-table';

class NormalTable extends React.Component {
    componentWillMount() {
        if (!this.props.target.status) {
            this.props.GetMount(this.props.targetID);
        }
        if (!this.props.loaded) {
            this.props.getData(this.props.targetID, this.props.api);
        }
    }

    //根据当前按钮打开相应按钮组件
    judgementOpenButtonGroupComponent() {
        let isShow = this.props.nowOnClickButton ? true : false;
        if (this.props.nowOnClickButton) {
            switch (this.props.nowOnClickButton.componentName) {
                case 'add':
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
                        this.props.submitModifyData(this.props.targetID,data,'');
                        }
                    }
                    ></ButtonGroupModifier>);
                    break;
                case 'delete':
                    return <ButtonGroupDeleter isShow={isShow} deleteFunc={()=>{
                    this.props.submitDeleteData(this.props.targetID,this.props.nowOnItem,'');
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
            return (<thead>
            <tr>
                <th style={{width:'20px',borderRight:'0'}}></th>
                <th style={{width:'20px',borderLeft:'0'}}></th>
                {mapTh()}</tr>
            </thead>)
        }
        let createTableBody = ()=> {
            let mapTd = (val)=> {
                return this.props.viewPoint.map((v, k)=> {
                    if (v.isEnable) {
                        return (<td key={k}>{val[v.name]}</td>);
                    }
                })
            }

            let createTrClassName = (v)=> {
                if (v === this.props.nowOnItem) {
                    return 'active';
                }
            }

            return <tbody>{this.props.data.map((v, k)=> {
                return (<tr className={createTrClassName(v)} onClick={(e)=>{
                            this.props.checkOnItem(this.props.targetID,v);
                            e.stopPropagation();
                        }} key={k}>
                    <td></td>
                    <td>{k + 1}</td>
                    {mapTd(v)}
                </tr>);
            })}</tbody>
        }

        return (<div className="normal-table-content">
            <table style={{width:'95%',margin:'0 auto'}}>
                {createTableHead()}
                {createTableBody()}
            </table>
        </div>);
    }

    renderPC() {
        let height = this.props.height;
        return (
            <div className="content-container animation-fadeInRight">

                    <div onClick={
                    ()=>{
                            if(this.props.nowOnItem){
                                this.props.checkOnItem(this.props.targetID,undefined);
                            }
                        }
                } className="content-container-inset" style={{height: height}}>
                        <Loader options={LoaderOption} loaded={this.props.loaded}>
                        {this.judgementOpenButtonGroupComponent()}
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
    let loaded, target, btnGroup, viewPoint, modifyViewPoint, targetID, api, data, nowOnItem, nowOnClickButton, modifyViewData;
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
    data = target.status ? target.status.data : [];
    nowOnItem = target.status ? target.status.checkOnItem : undefined;
    nowOnClickButton = target.status ? target.status.nowOnClickButton : undefined;
    modifyViewData = target.status ? target.status.modifyViewData : undefined;
    loaded = target.status ? target.status.loaded : false;
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
        //根据API获取的数据
        data: data,
        //当前选中的项
        nowOnItem: nowOnItem,
        //当前选中的按钮
        nowOnClickButton: nowOnClickButton,
        //当前模态框中数据
        modifyViewData: modifyViewData
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(state, action)(NormalTable);
