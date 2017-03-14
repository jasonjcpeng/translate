import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/menu-setting-option-menu';
//Component
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
import classNames from 'classnames';

class MenuSettingOptionAddMenu extends React.Component {
    componentWillMount() {
        if (!this.props.target.status) {
            this.props.GetMount(this.props.target);
        }
    }

    judgeRenderFunction() {
        let progressState = this.props.target.status.progress;
        let nowOnProgress = function () {
            for (let i in progressState) {
                if (progressState[i].on) {
                    return i;
                }
            }
        }();
        switch (nowOnProgress){
            case '0':
                return this.createOperationSetUp();
                break;
            case '1':
                return <div>视图</div>
                break;
            case '2':
                return <div>按钮</div>
                break;
            case '3':
                return <div>添加修改</div>
                break;
        }

    }

    createIsRootMenuCheckBox() {
        if (this.props.target.obj.targetMenu !== '0') {
            return (
                <span><input style={{cursor:'pointer'}} type="checkbox" defaultChecked={this.props.isRootMenu} onChange={e=>{
                            this.props.checkIsRootMenu(e.target.checked);
                        }}/>父级菜单</span>);
        }
    }

    createOperationSetUp() {
        return (
            <div className="standard-ul standard-ul-two-column">
                <ul>
                    <li><span>上级菜单:</span><input type="text" disabled={true}
                                                 value={this.props.target.obj.targetMenu === '0'?"根级菜单":this.props.target.obj.targetMenu.menuName}/>
                        {this.createIsRootMenuCheckBox()}</li>
                    <li><span>上级菜单Code:</span><input type="text" disabled={true}
                                                     value={this.props.target.obj.targetMenu === '0'?"0":this.props.target.obj.targetMenu.code}/>
                    </li>
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
        let progressState = this.props.target.status.progress;
        if (progressState) {
            let stepOne = classNames({'active': progressState[0].active, 'now-on': progressState[0].on});
            let stepTwo = classNames({'active': progressState[1].active, 'now-on': progressState[1].on});
            let stepThree = classNames({'active': progressState[2].active, 'now-on': progressState[2].on});
            let stepFour = classNames({'active': progressState[3].active, 'now-on': progressState[3].on});
            if (this.props.isRootMenu) {
                return (<div className="option-menu-progress">
                    <ul>
                        <li style={{width: "100%", cursor: 'default',fontSize:'200%'}}
                            className="active singleProgress">节点菜单功能
                        </li>
                    </ul>
                </div>);
            } else {
                return (<div className="option-menu-progress">
                    <ul>
                        <li onClick={
                            ()=>{
                            if(progressState[0].active){
                            this.props.clickChangeSetp(0);
                            }
                            }
                        } className={stepOne}><span>①</span>&nbsp;功能
                        </li>
                        <li onClick={
                            ()=>{
                            if(progressState[1].active){
                            this.props.clickChangeSetp(1);
                            }
                            }
                        } className={stepTwo}><span>②</span>&nbsp;视图
                        </li>
                        <li onClick={
                            ()=>{
                            if(progressState[2].active){
                            this.props.clickChangeSetp(2);
                            }
                            }
                        } className={stepThree}><span>③</span>&nbsp;按钮
                        </li>
                        <li onClick={
                            ()=>{
                            if(progressState[3].active){
                            this.props.clickChangeSetp(3);
                            }
                            }
                        } className={stepFour}><span>④</span>&nbsp;添加修改
                        </li>
                    </ul>
                </div>);
            }
        }
    }

    createFooterNextStepButton() {
        let progressState = this.props.target.status.progress;
        let nextStep = function () {
            for (let i in progressState) {
                if (progressState[i].on) {
                    return ++i;
                }
            }
        }();
        if (!this.props.isRootMenu && nextStep < 4) {
            return (<button onClick={()=>{
                this.props.clickNextStep(nextStep);
            }} className="btn">下一步</button>);
        }
    }

    createFooterLastStepButton() {
        let progressState = this.props.target.status.progress;
        let lastStep = function () {
            for (let i in progressState) {
                if (progressState[i].on) {
                    return --i;
                }
            }
        }();
        if (!this.props.isRootMenu && lastStep > -1) {
            return (<button className="btn" onClick={
            ()=>{
            this.props.clickChangeSetp(lastStep);
            }
            }>上一步</button>);
        }
    }

    createFooterFinishStepButton() {
        let progressState = this.props.target.status.progress;
        let Step = function () {
            for (let i in progressState) {
                if (progressState[i].on) {
                    return i;
                }
            }
        }();
        if (this.props.isRootMenu || Step === '3') {
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
    if (target.obj.targetMenu === '0') {
        isRootMenu = true;
    } else {
        isRootMenu = target.status.isRootMenu;
    }
    return ({
        isRootMenu: isRootMenu,
        target: target,
        defaultToggleStatus: state.common.defaultToggleStatus
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(MenuSettingOptionAddMenu);

