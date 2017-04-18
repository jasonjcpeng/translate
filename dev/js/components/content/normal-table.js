import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/normal-table';

class NormalTable extends React.Component {
    componentWillMount(){
        if (!this.props.target.status) {
            this.props.GetMount(this.props.targetID);
        }
        this.props.getData(this.props.targetID,this.props.api);
    }

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
                    if(v.isEnable){
                        return <th style={{width:v.width+'%'}} key={k}>{v.CNName}</th>;
                    }
                })
            }
            return (<tr>
                {mapTh()}
            </tr>)
        }
        let createTableBody = ()=>{
            let mapTd =(val)=>{
                return this.props.viewPoint.map((v,k)=>{
                    if(v.isEnable){
                        return (<td key={k}>{val[v.name]}</td>);
                    }
                })
            }

            return this.props.data.map((v,k)=>{
                return (<tr key={k}>
                    {mapTd(v)}
                </tr>);
            });
        }

        return (<div className="normal-table-content">
            <table>
                {createTableHead()}
                {createTableBody()}
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
        console.log('ConponentRender:');
        console.log(this.props.target);
        switch (this.props.defaultToggleStatus) {
            case 'none':
                return (<div className="normal-table"></div>);
                break;
        }
        return <div className="normal-table">{this.renderPC()}</div>;

    }
}


const state = state=> {
    let target,btnGroup,viewPoint,modifyViewPoint,targetID,api,data;
    state.containerTitleMenu.activeContent.map(v=> {
        if (v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
        }
    });
    targetID = target.obj.id?target.obj.id:'';
    api = target.obj.api?target.obj.api:'';
    btnGroup = target.obj.btnGroup?target.obj.btnGroup:[];
    viewPoint = target.obj.viewPoint?target.obj.viewPoint:[];
    modifyViewPoint = target.obj.modifyViewPoint?target.obj.modifyViewPoint:[];
    data = target.status?target.status.data:[];
    return ({
        target: target,
        //btnGroup 按钮组
        btnGroup:btnGroup,
        //viewPoint 表格字段
        viewPoint:viewPoint,
        //modifyViewPoint 遮罩层字段
        modifyViewPoint:modifyViewPoint,
        //本页面的头信息ID
        targetID:targetID,
        //本页面关联的获取数据的api
        api:api,
        //根据API获取的数据
        data:data
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(state, action)(NormalTable);
