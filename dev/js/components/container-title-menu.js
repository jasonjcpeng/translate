import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/side-bar';

class ContainerTittleMenu extends Component {
    render(){
        this.isCreateScrollBar = this.props.toggleStatus ==='full'?true:false;
        if (this.isCreateScrollBar) {
            return (
                <div className="title-menu">
                    <div className="title-menu-button"><i className="fa fa-backward"></i></div>
                    <div className="title-menu-container" style={{left: '260px'}}>
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
        toggleStatus:state.common.toggleStatus
    });
}


function action(dispatch) {
    return bindActionCreators({}, dispatch);
}


export default connect(state, action)(ContainerTittleMenu);
