import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/menu-setting-option-menu';
//Component
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
import ClassNames from 'classnames';

class MenuSettingOptionAddMenu extends React.Component {
    componentWillMount() {
        if (!this.props.target.status) {
            this.props.GetMount(this.props.target);
        }
    }

    judgeRenderFunction() {
        return this.createOperationSetUp();
    }

    createOperationSetUp() {
        return (
            <div className="">
                <ul>
                    <li><span>上级菜单:</span>{this.props.target.obj.targetMenu === '0'?"根级菜单":this.props.target.obj.targetMenu.menuName}</li>
                    <li><span>上级菜单Code:</span>{this.props.target.obj.targetMenu === '0'?"0":this.props.target.obj.targetMenu.code}</li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                    <li><span>菜单名称:</span><input type="text"/></li>
                </ul>
            </div>);

    }

    createOptionMenuProgress() {
        if (this.props.isRootMenu) {
            return (<div className="option-menu-progress">
                <ul>
                    <li style={{width: "100%", cursor: 'default',fontSize:'200%'}} className="active singleProgress">节点菜单功能</li>
                </ul>
            </div>);
        } else {
            return (<div className="option-menu-progress">
                <ul>
                    <li className="active now-on"><span>①</span>&nbsp;功能</li>
                    <li className="active"><span>②</span>&nbsp;视图</li>
                    <li><span>③</span>&nbsp;按钮</li>
                    <li><span>④</span>&nbsp;添加修改</li>
                </ul>
            </div>);
        }
    }

    createFooterNextStepButton() {
        if(!this.props.isRootMenu){
            return (<button className="btn">下一步</button>);
        }
    }

    createFooterLastStepButton() {
        if (!this.props.isRootMenu){
            return (<button className="btn">上一步</button>);
        }
    }

    createFooterFinishStepButton() {
        if (this.props.isRootMenu){
            return (<button className="btn btn-finish">完成</button>);
        }
    }

    createFooter(height) {
        return (<div className="option-menu-footer">
            <div className="btn-group">
                {this.createFooterLastStepButton()}
                {this.createFooterNextStepButton()}
                {this.createFooterFinishStepButton()}
                </div>
        </div>);

    }

    renderPC() {
        let height = this.props.height;
        let bodyHeight = height - 150;
        return (
            <div className="content-container animation-fadeInRight">
                <div className="content-container-inset" style={{height: height}}>
                    {this.createOptionMenuProgress()}
                    <div style={{height: bodyHeight, clear: "both"}} className="content-setting-frame">
                        {this.judgeRenderFunction()}
                    </div>
                    {this.createFooter()}
                </div>
            </div>
        );

    }

    render() {
        switch (this.props.defaultToggleStatus) {
            case 'none':
                return (<div></div>);
                break;
        }
        return this.renderPC();

    }
}

const state = state=> {
    let target;
    let isRootMenu;
    state.containerTitleMenu.activeContent.map(v=> {
        if (v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
        }
    });
    if(target.obj.targetMenu === '0'){
        isRootMenu = true;
    }
    return ({
        isRootMenu:isRootMenu,
        target: target,
        defaultToggleStatus: state.common.defaultToggleStatus
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(MenuSettingOptionAddMenu);

