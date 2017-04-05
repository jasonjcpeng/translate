import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/menu-setting-option-menu';
//Component
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
import classNames from 'classnames';
import ShieldAlert from '../shield-alert';
import Checker from '../piecemeal-components/checker';
//json
import IconList from '../../../jsons/icon-list.json';
import BtnGroupList from '../../../jsons/btn-group-list.json';
//tool
import {getNowFormatDate, IsObjEmpty} from '../../config/tools';
import {isOnline} from '../../config/config'


class MenuSettingOptionAddMenu extends React.Component {
    componentWillMount() {
        if (!this.props.target.status) {
            this.props.GetMount(this.props.target.obj);
        }
    }

    //判断需要渲染哪个进度状态视图界面
    judgeRenderFunction() {
        let progressState = this.props.target.status.progress;
        let nowOnProgress = function () {
            for (let i in progressState) {
                if (progressState[i].on) {
                    return i;
                }
            }
        }();
        switch (nowOnProgress) {
            case '0':
                return this.createOperationSetUp();
                break;
            case '1':
                return this.createViewPointSetting();
                break;
            case '2':
                return this.createButtonGroupSetting();
                break;
            case '3':
                return <div>添加修改</div>
                break;
        }

    }

    createButtonGroupSetting() {
        let createBtnGroupList = ()=>{
            let btnGroupList = BtnGroupList;
            let render = [];
            let btnGroup = this.props.menuData.btnGroup;
            let handleOnClick = (componentName,btnGroupItem)=>{
                let btnItem = {
                    componentName:componentName,
                    isNeedTarget:btnGroupItem.isNeedTarget,
                    isToggle:btnGroupItem.isNeedTarget,
                    CNName:'',
                    api:''
                }
                let newBtnGroup = {}
                let count = 0;
                for(let i in btnGroup){
                    newBtnGroup[i] = btnGroup[i];
                    count++;
                }
                newBtnGroup[count]=btnItem;
                this.props.changeMenuData(this.props.targetMenuSort, 'btnGroup', newBtnGroup);
            }
            for(let componentName in btnGroupList){
                let item = (<li onClick={()=>{
                    handleOnClick(componentName,btnGroupList[componentName]);
                }}>{btnGroupList[componentName].remark}</li>);
                render.push(item);
            }
            return (<ul className="btn-group-setting-btn-group-list">{render}</ul>);
        }

        return <div className="btn-group-setting">{createBtnGroupList()}</div>;
    }

    //渲染表格视图设置
    createViewPointSetting() {
        let handleOnChange = (value)=> {
            this.props.changeMenuData(this.props.targetMenuSort, 'viewPoint', value);
        }

        let tBody = ()=> {
            let result = [];
            let viewPoint = this.props.menuData.viewPoint;
            for (let v in viewPoint) {
                let render = (<tr key={v}>
                    <td> <Checker key={viewPoint[v].isEnable} checkState={viewPoint[v].isEnable} funcOnClick={(callBackCheck)=>{
                            viewPoint[v].isEnable = callBackCheck;
                             handleOnChange(viewPoint);
                        }}  ></Checker></td>
                    <td>{v}</td>
                    <td><input onChange={
                    e=>{
                    let CNName = e.target.value;
                        viewPoint[v].CNName = CNName;
                        handleOnChange(viewPoint);
                    }
                    } value={viewPoint[v].CNName} type="text"/></td>
                    <td><input onChange={
                    e=>{
                    let width = (()=>{
                       if(e.target.value<0){
                       return 0;
                       }else if(e.target.value>100){
                       return 100;
                       }else{
                       return e.target.value
                       }
                    })();
                        viewPoint[v].width = width;
                        handleOnChange(viewPoint);
                    }
                    } value={viewPoint[v].width} min="0" max="100" type="number"/></td>
                </tr>);
                result.push(render);
            }
            return result;
        }

        let table = (<table className="setting-table">
            <thead>
            <tr>
                <th>是否呈现</th>
                <th>Api字段名</th>
                <th>匹配中文名</th>
                <th>宽度设置(%)</th>
            </tr>
            </thead>
            <tbody>
            {tBody()}
            </tbody>
        </table>);

        return (<div >{table}</div>);

    }


    //渲染功能设置
    createOperationSetUp() {
        let createIsRootMenuCheckBox = ()=> {
            return (
                <li><span>作为节点菜单:</span>
                    <Checker key={this.props.isRootMenu} checkState={this.props.isRootMenu} funcOnClick={(callBackCheckState)=>{
                        this.props.checkIsRootMenu(this.props.targetMenuSort,callBackCheckState);
                    }}></Checker>
                </li> );
        }


        let iconClassName = (()=> {
            if (this.props.menuData.icon !== '') {
                return 'fa ' + this.props.menuData.icon;
            } else {
                return '';
            }
        })();
        let iContent = (()=> {
            if (this.props.menuData.icon === '') {
                return '空';
            } else {
                return '';
            }
        })();
        return (
            <div className="standard-ul standard-ul-two-column">
                <ul>
                    <li><span>上级菜单:</span><span><input type="text" disabled={true}
                                                       value={this.props.target.obj.targetMenu === '0'?"根级菜单":this.props.target.obj.targetMenu.menuName}/></span>
                    </li>
                    {createIsRootMenuCheckBox()}
                    <li><span>上级菜单Code:</span><span><input type="text" disabled={true}
                                                           value={this.props.target.obj.targetMenu === '0'?"0":this.props.target.obj.targetMenu.code}/></span>
                    </li>
                    <li><span>菜单名称:</span><span><input
                        defaultValue={this.props.menuData.menuName!==''?this.props.menuData.menuName:''} onChange={
                        e=>{
                            this.props.changeMenuData(this.props.targetMenuSort,'menuName',e.target.value);
                        }
                    } type="text"/></span></li>
                    {(()=> {
                        if (!this.props.isRootMenu) {
                            return (<div>
                                <li><span>菜单视图项API:</span><span><input
                                    defaultValue={this.props.menuData.viewPointConfigApi} onChange={
                                    e=>{
                                        this.props.changeMenuData(this.props.targetMenuSort,'viewPointConfigApi',e.target.value);
                                    }
                                } type="text"/></span></li>
                                <li><span>菜单内容项API:</span><span><input defaultValue={this.props.menuData.api} onChange={
                                    e=>{
                                        this.props.changeMenuData(this.props.targetMenuSort,'api',e.target.value);
                                    }
                                } type="text"/></span></li>
                                <li><span>视图类型:</span><span><select value={this.props.menuData.menuSort} onChange={e=>{
                                    this.props.changeMenuData(this.props.targetMenuSort,'menuSort',e.target.value);
                                }}>
                                {(()=> {
                                    let allSort = [0, 1, 2, 3];

                                    function writeContent(sort) {
                                        switch (sort) {
                                            case 0:
                                                return '普通表格';
                                                break;
                                            case 1:
                                                return '一般表格';
                                                break;
                                            case 2:
                                                return '高级表格';
                                                break;
                                            case 3:
                                                return '超级表格';
                                                break;
                                        }
                                    }

                                    return allSort.map((v, k)=> {
                                        return (<option key={k} value={v}>{writeContent(v)}</option>);
                                    });
                                }).apply(this)}
                            </select></span></li>
                            </div>);
                        }
                    })()}
                    <li><span>菜单图标:</span><span><i style={{fontStyle:'normal'}} onClick={()=> {
                        this.props.toggleIconSetting(this.props.targetMenuSort);
                    }} className={iconClassName}>{iContent}</i></span></li>
                </ul>
            </div>);

    }

    //渲染进度状态条
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
                                this.props.clickChangeSetp(this.props.targetMenuSort, 0);
                            }
                            }
                        } className={stepOne}><span>①</span>&nbsp;功能
                        </li>
                        <li onClick={
                            ()=>{
                            if(progressState[1].active){
                                this.props.clickChangeSetp(this.props.targetMenuSort, 1);
                            }
                            }
                        } className={stepTwo}><span>②</span>&nbsp;视图
                        </li>
                        <li onClick={
                            ()=>{
                            if(progressState[2].active){
                                this.props.clickChangeSetp(this.props.targetMenuSort, 2);
                            }
                            }
                        } className={stepThree}><span>③</span>&nbsp;按钮
                        </li>
                        <li onClick={
                            ()=>{
                            if(progressState[3].active){
                                this.props.clickChangeSetp(this.props.targetMenuSort, 3);
                            }
                            }
                        } className={stepFour}><span>④</span>&nbsp;添加修改
                        </li>
                    </ul>
                </div>);
            }
        }
    }

    //渲染页脚按钮
    createFooter(height) {
        let createFooterLastStepButton = ()=> {
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
                this.props.clickChangeSetp(this.props.targetMenuSort, lastStep);
            }
            }>上一步</button>);
            }
        }

        let createFooterNextStepButton = ()=> {
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
                if(nextStep===1){
                    this.props.getViewPointConfig(this.props.targetMenuSort,this.props.menuData.viewPointConfigApi,()=>{
                        this.props.clickNextStep(this.props.targetMenuSort, nextStep);
                    });
                }else{
                    this.props.clickNextStep(this.props.targetMenuSort, nextStep);
                }
            }} className="btn">下一步</button>);
            }
        }

        let createFooterFinishStepButton = ()=> {
            let deleteActiveContent = (k, v)=> {
                this.props.closeMenuSetting(k, v);
                let result = null;
                if (k > 0 && k + 1 === this.props.activeContent.length) {
                    result = this.props.activeContent[k - 1];
                } else if (this.props.activeContent.length > 0) {
                    result = this.props.activeContent[k + 1];
                }
                result ? this.props.selectActiveContent(result) : '';
            }

            let handleFinishButton = ()=> {
                let menuData = this.props.menuData;
                switch (this.props.targetMenuSort) {
                    case 'menuSettingAddMenu':
                        if (isOnline) {

                        } else {
                            let allMenu = this.props.allMenu;
                            let createTime = getNowFormatDate();
                            let updateTime = getNowFormatDate();
                            let id = allMenu.length + 1;
                            let parentCode = '';
                            if (this.props.target.obj.targetMenu.code) {
                                parentCode = this.props.target.obj.targetMenu.code;
                            } else {
                                parentCode = '0';
                            }
                            let code = '';
                            let deCode = 1;
                            for (let i in allMenu) {
                                if (allMenu[i].parentCode === parentCode) {
                                    deCode++;
                                }
                            }
                            code = (parentCode === '0' ? '' : parentCode) + '' + deCode;
                            menuData.createtime = createTime;
                            menuData.updatetime = updateTime;
                            menuData.id = id;
                            menuData.code = code;
                        }
                        break;
                }
                this.props.clickFinish(menuData);
                deleteActiveContent(this.props.nowOnContentKey, this.props.target.obj);
            }

            let progressState = this.props.target.status.progress;
            let Step = function () {
                for (let i in progressState) {
                    if (progressState[i].on) {
                        return i;
                    }
                }
            }();
            if (this.props.isRootMenu || Step === '3') {
                return (<button onClick={()=>{
                handleFinishButton();
            }} className="btn btn-finish">完成</button>);
            }

        }

        return (<div className="option-menu-footer">
            <div className="btn-group">
                {createFooterLastStepButton()}
                {createFooterNextStepButton()}
                {createFooterFinishStepButton()}
            </div>
        </div>);

    }

    //渲染通知遮罩层
    createAlertShield() {
        let onOkFunc = ()=> {
            this.props.clickShieldAlertOK(this.props.targetMenuSort);
        }
        if (this.props.target.status.error) {
            return (
                <ShieldAlert title="警告" content={this.props.target.status.error} onOkFunc={onOkFunc}></ShieldAlert>);
        }
    }

    //渲染按钮设置遮罩层
    createToggleIconSetting() {
        if (this.props.target.status.isToggleIconSetting) {
            return (
                <div className="shield">
                    <div className="shield-content">
                        <ul>
                            {
                                (()=> {
                                    return IconList.IconList.map((e, k)=> {
                                        if (e.name === '') {
                                            return (<li key={k}><i onClick={()=>{
                                                this.props.toggleIconSetting(this.props.targetMenuSort,e.name)
                                            }} style={{fontStyle:'normal'}}>空</i></li> );
                                        }
                                        return (<li key={k}><i onClick={()=>{
                                            this.props.toggleIconSetting(this.props.targetMenuSort,e.name)
                                        }} className={'fa '+e.name}></i></li> );
                                    });
                                })()
                            }
                        </ul>
                    </div>
                </div>
            );
        }
    }


    renderPC() {
        let height = this.props.height;
        let bodyHeight = height - 150;
        return (
            <div className="content-container animation-fadeInRight">
                {this.createToggleIconSetting()}
                {this.createAlertShield()}
                <div className="content-container-inset" style={{height: height}}>
                    <div style={{minWidth: 600}}>
                        {this.createOptionMenuProgress()}
                        <div style={{height: bodyHeight, clear: "both"}} className="content-setting-frame">
                            {this.judgeRenderFunction()}
                        </div>
                        {this.createFooter()}
                    </div>
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
    let target, nowOnContentKey;
    state.containerTitleMenu.activeContent.map((v, k)=> {
        if (v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
            nowOnContentKey = k;
        }
    });
    return ({
        allMenu: state.sideBar.menu,
        activeContent: state.containerTitleMenu.activeContent,
        //本选项卡头包含的选项卡内数据{obj:选项卡菜单，status：选项卡内状态，isActive:是否正使用}
        target: target,
        //视图层通过菜单视图项Api获取的表字段内容
        viewPointConfigData: target.status.viewPointConfigData,
        //当前选项卡所在数组的位置，用来关闭本选项卡
        nowOnContentKey: nowOnContentKey,
        isRootMenu: target.status.isRootMenu,
        configApi: target.status.configApi,
        targetMenuSort: target.obj.menuSort,
        menuData: target.status.menuData,
        defaultToggleStatus: state.common.defaultToggleStatus
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(MenuSettingOptionAddMenu);

