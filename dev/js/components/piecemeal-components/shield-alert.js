import React from 'react';
import {connect} from 'react-redux';
import * as Constants from '../../action/CONSTANTS';
import {bindActionCreators} from 'redux';
/*
* @param
* targetType:分类方式 (补漏)
* onTargetMenuTarget:当前导航页的标识
* content:错误信息
* title:标题
* */
class ShieldAlert extends React.Component {
    constructor(props){
        super();
        this.state ={
            onTargetMenu:props.onTargetMenuTarget,
            content:props.content,
            title:props.title,
            targetType:props.targetType
        }
    }

    render() {
        if(this.state.content){
            return (<div className="shield">
                <div className="shield-alert">
                    <div className="alert-header">{this.state.title}</div>
                    <div className="alert-content">
                        {this.state.content}
                    </div>
                    <div className="alert-footer">
                        <button onClick={e=>{this.props.onOkDeleteErrorFlag(this.state.onTargetMenu,this.props.targetType)}} className="btn btn-finish">OK</button>
                    </div>
                </div>
            </div>);
        }else{
            return <div></div>;
        }
    }
}

ShieldAlert.defaultProps = {

}

let state = (state)=>{
    return ({});
}

let action = (dispatch)=>{
    let actions = {
        onOkDeleteErrorFlag:(target,targetType)=>{
            return ({
                type:Constants.SHIELD_ALERT_ON_OK_DELETE_ERROR_FLAG,
                target:target,
                targetType:targetType
            });
        }
    }
    return bindActionCreators(actions,dispatch);
}


export default connect(state,action)(ShieldAlert);