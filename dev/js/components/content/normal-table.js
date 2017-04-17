import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/menu-setting-option-menu';

class NormalTable extends React.Component {

    createOptionBar() {
        let mapButton = ()=>{
            return this.props.btnGroup.map((v,k)=>{
                if(k===0){
                   return  <li className="first-child">{v.CNName}</li>
                }else{
                    return <li >{v.CNName}</li>
                }
            });
        }
        return (<div className="normal-table-header">
            <div className="component-option-bar">
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
            let mapTh = ()=>{
                return this.props.viewPoint.map((v,k)=>{
                    return <th style={{width:v.width+'%'}} key={k}>{v.CNName}</th>;
                })
            }

            return (<tr>
                {mapTh()}
            </tr>)
        }

        return (<div className="normal-table-content">
            <table>
                {createTableHead()}
            </table>
        </div>);
    }

    renderPC() {
        let height = this.props.height;
        return (
            <div className="content-container animation-fadeInRight">
                <div className="content-container-inset" style={{height: height}}>
                    <div style={{minWidth: 600, height: '100%'}}>
                        {this.createOptionBar()}
                        {this.createTable()}
                    </div>
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
    let target,btnGroup,viewPoint,modifyViewPoint;
    state.containerTitleMenu.activeContent.map(v=> {
        if (v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
        }
    });
    btnGroup = target.obj.btnGroup?target.obj.btnGroup:[];
    viewPoint = target.obj.viewPoint?target.obj.viewPoint:[];
    modifyViewPoint = target.obj.modifyViewPoint?target.obj.modifyViewPoint:[];
    return ({
        target: target,
        //btnGroup 按钮组
        btnGroup:btnGroup,
        //viewPoint 表格字段
        viewPoint:viewPoint,
        //modifyViewPoint 遮罩层字段
        modifyViewPoint:modifyViewPoint
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(state, action)(NormalTable);
