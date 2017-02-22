import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ContainerTittleMenu from './container-title-menu';
//-----Content--------
import ContentSetting from './content/content-setting';
//--------------------

import * as ActionCreators from '../action/side-bar';

class Container extends Component {
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

    switchCreateContent(height){
        let boolean = this.props.toggleStatus!=='full'||this.props.defaultToggleStatus==='full';
        if(this.props.nowOnContentTarget&&boolean){
            switch (this.props.nowOnContentTarget.menuSort){
                case 'setting':
                    return (<ContentSetting height={height}/>);
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
