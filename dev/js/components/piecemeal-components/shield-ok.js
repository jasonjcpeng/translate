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
                <div className="shield-ok">
                    <div className="ok-header">{this.state.title}</div>
                    <div className="ok-content">
                        {this.state.content}
                    </div>
                    <div className="ok-footer">
                        <button onClick={e=>{this.props.onOkDeleteOkFlag(this.state.onTargetMenu,this.props.targetType); e.stopPropagation()}} className="btn btn-finish">OK</button>
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
        onOkDeleteOkFlag:(target,targetType)=>{
            return ({
                type:Constants.SHIELD_OK_ON_OK_DELETE_OK_FLAG,
                target:target,
                targetType:targetType
            });
        }
    }
    return bindActionCreators(actions,dispatch);
}


export default connect(state,action)(ShieldAlert);