import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ContainerTittleMenu from './container-title-menu';
//-----Content--------
import ContentSetting from './content/content-setting';
import MenuSettingOptionMenu from './content/menu-setting-option-menu';
import NormalTable from './content/normal-table';
import CustomTableDemo from './content/custom-table/custom-table-demo';
//--------------------

import * as ActionCreators from '../action/side-bar';

class Container extends Component {
    //根据当前相应状态获取外边距
    getContainerMargin() {
        switch (this.props.toggleStatus) {
            case 'full':
                return '220px';
                break;
            case 'mini':
                return '50px';
                break;
            case 'none':
                return '0px';
                break;
        }
    }
    //创造container收起的动画效果
    getContainerToggleAnimation() {
        switch (this.props.lastToggleStatus) {
            case 'full':
                switch (this.props.toggleStatus) {
                    case 'mini':
                        return 'container-margin-full-to-mini';
                        break;
                    case 'none':
                        return 'container-margin-full-to-none';
                        break;
                }
                break;
            case 'mini':
                switch (this.props.toggleStatus) {
                    case 'full':
                        return 'container-margin-mini-to-full';
                        break;
                    case 'none':
                        return '';
                        break;
                }
                break;
            case 'none':
                switch (this.props.toggleStatus) {
                    case 'full':
                        return 'container-margin-none-to-full';
                        break;
                    case 'mini':
                        return '';
                        break;
                }
                break;
        }
        return '';
    }
    //根据当前菜单类型获取Content中需要渲染的内容
    switchCreateContent(height){
        let boolean = this.props.toggleStatus!=='full'||this.props.defaultToggleStatus==='full';
        if(this.props.nowOnContentTarget&&boolean){
            switch (this.props.nowOnContentTarget.menuSort){
                case 'setting':
                    return (<ContentSetting height={height}/>);
                    break;
                case 'menuSettingAddMenu':
                    return (<MenuSettingOptionMenu key='add' height={height}/>);
                break;
                case 'menuSettingEditMenu':
                    return (<MenuSettingOptionMenu key='edit' height={height}/>);
                break;
                case 'menuSettingDetailMenu':
                    return (<MenuSettingOptionMenu key='detail' height={height}/>);
                    break;
                case 0:
                    return (<NormalTable key={this.props.nowOnContentTarget.id} height={height}></NormalTable>);
                    break;
                //todo:要求后台修改menuSort数据类型为string
                case 1:
                    return (<CustomTableDemo key={this.props.nowOnContentTarget.id} height={height}></CustomTableDemo>);
                    break;
                case '1':
                    return (<CustomTableDemo key={this.props.nowOnContentTarget.id} height={height}></CustomTableDemo>);
                    break;
            }
        }
    }

    renderNormal() {
        this.isCreateScrollBar = this.props.defaultToggleStatus === 'full'?true:false;
        let contentHeight = this.props.windowHeight - 93+(this.isCreateScrollBar?0:42);
        let containerMargin = this.getContainerMargin();
        return (
            <div  style={{marginLeft: containerMargin}} className={'container ' + this.getContainerToggleAnimation()}>
            <ContainerTittleMenu/>
            <div className="content" style={{height: contentHeight}}>
               {this.switchCreateContent(contentHeight)}
            </div>
        </div>);
    }

    render() {
            return  this.renderNormal();
    }
}

const state = state=>{
    return ({
        nowOnContentTarget:state.common.nowOnContentTarget,
        windowHeight: state.common.windowHeight,
        windowWidth: state.common.windowWidth,
        defaultToggleStatus: state.common.defaultToggleStatus,
        toggleStatus: state.common.toggleStatus,
        lastToggleStatus: state.common.lastToggleStatus
    });
}


const action = dispatch=>{
    return bindActionCreators({}, dispatch);
}


export default connect(state, action)(Container);
