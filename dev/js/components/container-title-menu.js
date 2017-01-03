import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/side-bar';

class ContainerTittleMenu extends Component {
    getContainerTittleMenuLeft(){
        switch (this.props.toggleStatus){
            case 'full':
                return '260px';
                break;
            case 'mini':
                return '110px';
                break;
            case 'none':
                return '40px';
                break;
        }
    }

    getContainerTittleMenuLeftAnimation(){
        switch (this.props.lastToggleStatus){
            case 'full':
                switch (this.props.toggleStatus){
                    case 'mini':
                        return 'container-title-menu-full-to-mini';
                        break;
                    case 'none':
                        return '';
                        break;
                }
                break;
            case 'mini':
                switch (this.props.toggleStatus){
                    case 'full':
                        return 'container-title-menu-mini-to-full';
                        break;
                    case 'none':
                        return '';
                        break;
                }
                break;
            case 'none':
                switch (this.props.toggleStatus){
                    case 'full':
                        return '';
                        break;
                    case 'mini':
                        return '';
                        break;
                }
                break;
        }
    }

    render(){
        this.isCreateScrollBar = this.props.defaultToggleStatus ==='full'?true:false;
        let left = this.getContainerTittleMenuLeft();
        if (this.isCreateScrollBar) {
            return (
                <div className="title-menu">
                    <div className="title-menu-button"><i className="fa fa-backward"></i></div>
                    <div className={"title-menu-container "+this.getContainerTittleMenuLeftAnimation()} style={{left:left}}>
                        <ul>
                            <li>首页 <i className="fa fa-times-circle"></i></li>
                            <li>百度云库 <i className="fa fa-times-circle"></i></li>
                            <li className="active">图表<i className="fa fa-times-circle"></i></li>
                            <li>图表<i className="fa fa-times-circle"></i></li>
                            <li>图表<i className="fa fa-times-circle"></i></li>
                        </ul>
                    </div>
                    <div className="title-menu-button title-menu-button-exit"><i className="fa fa-sign-out"></i>退出</div>
                    <div className="title-menu-button title-menu-button-close">关闭操作 <i className="fa fa-caret-down"></i>
                    </div>
                    <div className="title-menu-button title-menu-button-forward"><i className="fa fa-forward"></i></div>
                </div>
            );
        } else {
            return (<div></div> );
        }
    }
}

function state(state) {
    return ({
        defaultToggleStatus:state.common.defaultToggleStatus,
        toggleStatus:state.common.toggleStatus,
        lastToggleStatus:state.common.lastToggleStatus
    });
}


function action(dispatch) {
    return bindActionCreators({}, dispatch);
}


export default connect(state, action)(ContainerTittleMenu);
