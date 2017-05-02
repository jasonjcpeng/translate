import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/content-setting';
//Component
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
import ShieldAlert from '../piecemeal-components/shield-alert';
import ShieldOk from '../piecemeal-components/shield-ok';
//JSON
import SkinList from '../../../jsons/skin-list.json';
import menuSettingOption from '../../../jsons/menu-setting-option.json';

class ContentSetting extends React.Component {
    /*
     * 为了使存储在container-title-menu中的ActiveContent数组正确找到当前启动标签的位置以及本页面在ActiveContent数组中
     * 加载初始化状态，需要在组件第一次渲染前重新定向，并再次渲染。这个事件中也可以包含本页面需要从后台获取的数据的异步方法。
     * */
    componentWillMount() {
        if (!this.props.target.status) {
            this.props.contentSettingGetMount(this.props.nowOnContentTarget);
        }
    }

    createContentSettingNavBar(arr) {
        return arr.map((v)=> {
            return (<li className={function(){
                if(this.props.target.status.rightActiveContent.key===v.key){
                return 'active';
                }
            }.bind(this)()} onClick={()=>{
                this.props.checkRightActiveContainer(this.props.target.obj.menuSort,v);
            }} key={v.key}>{v.name}</li>)
        })
    }

    createActiveContentHeader(rightActiveContent) {
        return (<div className="right-active-content-header">
            {rightActiveContent.name}
            <div className="br-line"></div>
        </div>);
    }

    createBaseInfo(rightActiveContent, tableHeight) {
        this.protoBaseInfo = {
            name:this.props.userInfo.name,
            nickName:this.props.userInfo.nickName,
            birthDay:this.props.userInfo.birthDay.substring(0,(this.props.userInfo.birthDay.indexOf('T')))
        }

        let handleOnChangeBaseInfo = (key,val)=>{
            this.protoBaseInfo[key] = val;
        }

        let height = tableHeight - 50;
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            {this.createActiveContentHeader(rightActiveContent)}
            <div style={{height: height}} className="content-setting-frame">
                <div style={{height: height-80}}>
                    <div className="standard-ul">
                        <ul>
                            <li><span>姓名</span><input onChange={e=>{
                                handleOnChangeBaseInfo('name',e.target.value);
                            }} type="text" defaultValue={this.protoBaseInfo.name}/></li>
                            <li><span>昵称</span><input onChange={e=>{
                                handleOnChangeBaseInfo('nickName',e.target.value);
                            }} type="text" defaultValue={this.protoBaseInfo.nickName}/></li>
                            <li><span>生日</span><input onChange={e=>{
                                handleOnChangeBaseInfo('birthDay',e.target.value);
                            }} type="date" defaultValue={this.protoBaseInfo.birthDay}/></li>
                            <li><span>账户描述</span><input disabled="disabled" type="text" defaultValue={this.props.userInfo.description}/></li>
                            <li><span>权限</span><input type="text" disabled="disabled" defaultValue={this.props.userInfo.power}/></li>
                            <li><span>账户创建时间</span><input disabled="disabled" type="text" defaultValue={this.props.userInfo.createTime}/></li>
                        </ul>
                    </div>
                </div>
                <div className="content-setting-footer">
                    <button onClick={e=>{
                        this.props.actionChangeUserInfo(this.props.userInfo.id,this.protoBaseInfo);
                    }} className="btn btn-finish">确认修改</button>
                </div>
            </div>
        </div>);
    }

    createTel(rightActiveContent, tableHeight) {
        let height = tableHeight - 50;
        this.protoTelInfo = {
            mobilePhone:this.props.userInfo.mobilePhone,
            eMail:this.props.userInfo.eMail,
        }
        let handleOnChangeTelInfo = (key,val)=>{
            this.protoTelInfo[key] = val;
        }
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            {this.createActiveContentHeader(rightActiveContent)}
            <div style={{height: height}} className="content-setting-frame">
                <div style={{height: height-80}}>
                    <div className="standard-ul">
                        <ul>
                            <li><span>手机号</span><input onChange={e=>{
                                handleOnChangeTelInfo('mobilePhone',e.target.value);
                            }} type="tel" defaultValue={this.protoTelInfo.mobilePhone}/></li>
                            <li><span>E-Mail</span><input onChange={e=>{
                                handleOnChangeTelInfo('eMail',e.target.value);
                            }} type="email" defaultValue={this.protoTelInfo.eMail}/></li>
                        </ul>
                    </div>
                </div>
                <div className="content-setting-footer">
                    <button onClick={e=>{
                        this.props.actionChangeUserInfo(this.props.userInfo.id,this.protoTelInfo);
                    }}  className="btn btn-finish">确认修改</button>
                </div>
            </div>

        </div>);
    }

    createResetPassWord(rightActiveContent, tableHeight){
        let height = tableHeight - 50;
        this.protoResetPassWord = {
            oldPassWord:'',
            newPassWord:'',
            confirmPassWord:''
        }
        let handleOnChangeResetPassWordInfo = (key,val)=>{
            this.protoResetPassWord[key] = val;
        }
        let handleOnFinishResetPassWord = ()=>{
            if(this.protoResetPassWord.oldPassWord!==this.protoResetPassWord.newPassWord){
                if(this.protoResetPassWord.newPassWord===this.protoResetPassWord.confirmPassWord){
                    this.props.actionResetPassWord(this.props.userInfo.account,this.protoResetPassWord);
                }else{
                    this.props.actionSendError('两次输入的密码不同！');
                }
            }else{
                this.props.actionSendError('新旧密码不能相同！');
            }
        }
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            {this.createActiveContentHeader(rightActiveContent)}
            <div style={{height: height}} className="content-setting-frame">
                <div style={{height: height-80}}>
                    <div className="standard-ul">
                        <ul>
                            <li><span>原密码</span><input  onChange={e=>{
                                handleOnChangeResetPassWordInfo('oldPassWord',e.target.value);
                            }} type="password" /></li>
                            <li><span>新密码</span><input  onChange={e=>{
                                handleOnChangeResetPassWordInfo('newPassWord',e.target.value);
                            }} type="password" /></li>
                            <li><span>再次输入密码</span><input  onChange={e=>{
                                handleOnChangeResetPassWordInfo('confirmPassWord',e.target.value);
                            }} type="password" /></li>
                        </ul>
                    </div>
                </div>
                <div className="content-setting-footer">
                    <button onClick={e=>{
                        handleOnFinishResetPassWord();
                    }} className="btn btn-finish">确认修改</button>
                </div>
            </div>

        </div>);
    }

    createSkinItem(arr) {
        return arr.map(v=> {
            return ( <div key={v.key} className={function(){
            if(this.props.useSkin===v.key){
                return 'active'
            }
            }.bind(this)()} onClick={()=>{
                this.props.changeSkin(v.key);
            }} style={{backgroundColor:v.img}}></div>);
        });
    }

    createSkin(rightActiveContent, tableHeight) {
        let height = tableHeight - 50;
        let arr = SkinList.skinList;
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            {this.createActiveContentHeader(rightActiveContent)}
            <div style={{height: height}} className="content-setting-frame">
                <div className="skin-group">
                    {this.createSkinItem(arr)}
                </div>
            </div>
        </div>);
    }

    isMenuHasChild(newMenu, currentMenu) {
        for (let i in newMenu) {
            if (newMenu[i].parentCode === currentMenu.code) {
                return true;
                break;
            }
        }
        return false;
    }

    quickSort(arr, root = {code: '0'}, result=[]) {
        let menu = [];
        if (arr.length > 0) {
            let newArr = arr.filter(v=> {
                if (v.parentCode === root.code) {
                    menu.push(v);
                } else {
                    return v;
                }
            });
            if (menu.length > 0) {
                for (let i in menu) {
                    result.push(menu[i]);
                    this.quickSort(newArr, menu[i], result);
                }
            }
        }
        return result;
    }

    isSingleMenuSettingTableToggle(toggleCode, menuCode) {
        for (let i in toggleCode) {
            if (menuCode === toggleCode[i]) {
                return true;
            }
        }
        return false;
    }

    createMenuSettingTableBody(toggleCode) {
        let menu = this.quickSort(this.props.currentMenu);
        let trIsHidden = (v)=>{
            let toggleStateFlag = true;
            if(v.parentCode==='0'){
                toggleStateFlag = false;
            }else{
                for(let i in toggleCode){
                    if(v.parentCode===toggleCode[i]){
                        toggleStateFlag = false;
                    }
                }
            }
            return toggleStateFlag;
        }
        let createTrClassName = (v)=> {
            if (this.props.target.status.selectMenuSettingTableItem&&v.code === this.props.target.status.selectMenuSettingTableItem.code) {
                return 'active';
            }
        }
        let arrowIconMargin = (v,margin)=>{
            let localMargin = margin;
            for(let i=0;i<this.props.currentMenu.length;i++){
                if(v.parentCode===this.props.currentMenu[i].code){
                    localMargin += arrowIconMargin(this.props.currentMenu[i],(margin+5));
                }
            }
            return localMargin
        }
        let  isMenuHasChild =(newMenu, currentMenu)=>{
            for (let i in newMenu) {
                if (newMenu[i].parentCode === currentMenu.code) {
                    return true;
                    break;
                }
            }
            return false;
        }
        let trToggleIconClassNames = (v)=>{
            let toggleStateFlag = false;
            for(let i in toggleCode){
                if(v.code===toggleCode[i]){
                    toggleStateFlag = true;
                }
            }
            return toggleStateFlag?'menu-toggle fa fa-caret-down':'menu-toggle fa fa-caret-right';
        }
        return menu.map((v,k)=>{
            return (<tr hidden={trIsHidden(v)} className={createTrClassName(v)} onClick={(e)=>{
                this.props.selectSingleMenuItem(v);
                e.stopPropagation();
            }} key={k}>
                <td>{ (()=>{
                    return (<div style={{width:'40px',float:'left',paddingLeft:arrowIconMargin(v,15)+'px'}}>
                        {(()=>{
                            if (isMenuHasChild(menu, v)) {
                                return (<i onClick={(e)=>{
                                    this.props.toggleSingleMenuItem(v.code);
                                    e.stopPropagation();
                                }} className={trToggleIconClassNames(v)}></i>)
                            }else{
                                return (<i  className="menu-no-toggle"></i>)
                            }
                        })()}
                        <span style={{marginLeft:'5px'}}>{k + 1}</span>
                    </div>);
                })()}</td>
                <td style={{paddingLeft:arrowIconMargin(v,40)+'px'}}>{v.menuName}</td>
                <td ><i className={'fa ' + v.icon}></i></td>
                {/*<td onClick={
                    (e)=> {
                        let obj = v;
                        obj.isEnable = !v.isEnable;
                        this.props.changeMenuSetting(obj);
                        e.stopPropagation();
                    }
                }>{function () {
                    if (v.isEnable) {
                        return (<i className="fa fa-toggle-on"></i>);
                    } else {
                        return (<i className="fa fa-toggle-off"></i>);
                    }
                }.bind(this)()}</td>
                 <td>{v.menuSort}</td>*/}
                <td></td>
            </tr>);
        });

    }

    judgeRenderSettingOption() {
        if (this.props.target.status.selectMenuSettingTableItem) {
            return this.createMenuSettingOption();
        } else {
            return (<div key="rootOption" className="content-setting-header animation-fadeInRight animation-fadeIn">
                <div className="component-option-bar">
                    <ul>
                        <li onClick={
                            (e)=>{
                                this.props.toggleOffAllMenuItem();
                                e.stopPropagation();
                            }
                        } className="right-button"><i className="fa fa-reply-all"></i>&nbsp;全部收起
                        </li>
                        <li className="first-child" onClick={(e)=>{
                            menuSettingOption.add.targetMenu = '0';
                             this.props.openOption(menuSettingOption.add);
                             e.stopPropagation();
                        }}><i className="fa fa-plus"></i>&nbsp;新增父级节点
                        </li>
                    </ul>
                </div>
            </div>);
        }
    }

    createMenuSettingOption() {
        if (this.props.target.status.selectMenuSettingTableItem) {
            return (<div key="option" className="content-setting-header animation-fadeInRight animation-fadeIn">
                <div className="component-option-bar">
                    <ul>
                        <li onClick={
                            (e)=>{
                                this.props.toggleOffAllMenuItem();
                                e.stopPropagation();
                            }
                        } className="right-button"><i className="fa fa-reply-all"></i>&nbsp;全部收起
                        </li>
                        <li className="first-child" onClick={(e)=>{
                            menuSettingOption.add.targetMenu = this.props.target.status.selectMenuSettingTableItem;
                            this.props.openOption(menuSettingOption.add);
                            e.stopPropagation();
                        }}><i className="fa fa-plus"></i>&nbsp;新增
                        </li>
                        <li onClick={(e)=>{
                            menuSettingOption.edit.targetMenu = this.props.target.status.selectMenuSettingTableItem;
                            this.props.openOption(menuSettingOption.edit);
                            e.stopPropagation();
                        }}><i className="fa fa-pencil-square-o"></i>&nbsp;编辑
                        </li>
                        <li onClick={(e)=>{
                            menuSettingOption.detail.targetMenu = this.props.target.status.selectMenuSettingTableItem;
                            this.props.openOption(menuSettingOption.detail);
                            e.stopPropagation();
                        }}><i className="fa fa-columns"></i>&nbsp;详细
                        </li>
                        <li onClick={
                            (e)=>{
                                this.props.optionDeleteMenu(this.props.target.status.selectMenuSettingTableItem);
                                e.stopPropagation();
                            }
                        }><i className="fa fa-trash-o"></i>&nbsp;删除
                        </li>
                    </ul>
                </div>
            </div>);
        }
    }

    createMenuSetting(rightActiveContent, tableHeight) {
        let height = tableHeight - 100;
        return (<div onClick={
                    ()=>{
                    this.props.toggleSingleMenuItem(undefined);
                        }
                    } key={rightActiveContent.key} className=" right-active-content animation-fadeInRight ">
            <div style={{minWidth:700}}>
                {this.createActiveContentHeader(rightActiveContent)}
                {this.judgeRenderSettingOption()}
                <div style={{height: height}}
                     className="content-setting-frame">
                    <table>
                        <thead>
                        <tr>
                            <th style={{width:'60px'}}></th>
                            <th style={{width:'300px'}}>名称</th>
                            <th style={{width:'60px'}}>图标</th>
                          {/*  <th style={{width:'60px'}}>有效</th>*/}
                    {/*        <th style={{width:'100px'}}>菜单种类</th>*/}
                            <th>介绍</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.createMenuSettingTableBody(this.props.target.status.defaultMenuSettingTableToggleItem)}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>);
    }

    createRightActiveContent(tableHeight) {
        let rightActiveContent = this.props.target.status.rightActiveContent;
        switch (rightActiveContent.key) {
            case 'baseInfo':
                return this.createBaseInfo(rightActiveContent, tableHeight);
                break;
            case 'tel':
                return this.createTel(rightActiveContent, tableHeight);
                break;
            case 'resetPassWord':
                return this.createResetPassWord(rightActiveContent, tableHeight);
                break;
            case 'skin':
                return this.createSkin(rightActiveContent, tableHeight);
                break;
            case 'menuSetting':
                return this.createMenuSetting(rightActiveContent, tableHeight);
                return
        }
    }

    renderPC() {
        let tableHeight = this.props.height - 30;
        let contentSettingNavBar = [{key: 'baseInfo', name: '基本信息'}, {key: 'tel', name: '联系方式'}, {
            key: 'headImg',
            name: '我的头像'
        }, {key: 'resetPassWord', name: '修改密码'}, {key: 'skin', name: '设置皮肤'}];
        let contentSettingPowerNavBar = [{key: 'menuSetting', name: '编辑菜单'}];
        if (this.props.target.status) {
            return (
                <div>
                    <div className="content-container animation-fadeInRight"
                         style={{width:'15%',float:'left',marginLeft:'1%'}}>
                        <div className="content-container-inset" style={{height: tableHeight}}>
                            <div className="content-setting-nav-bar">
                                <ul>
                                    {this.createContentSettingNavBar(contentSettingNavBar)}
                                </ul>
                                <div className="br-line"></div>
                                <ul>
                                    {this.createContentSettingNavBar(contentSettingPowerNavBar)}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="content-container animation-fadeInRight"
                         style={{width:'80%',float:'right',marginRight:'1%'}}>
                        <ShieldAlert key={this.props.target.obj.menuSort+'error'+this.props.error} content={this.props.error} title={'Alert'} onTargetMenuTarget={'setting'}></ShieldAlert>
                        <ShieldOk key={this.props.target.obj.menuSort+'ok'+this.props.ok} content={this.props.ok} title={'Success'} onTargetMenuTarget={'setting'}></ShieldOk>
                        <div className="content-container-inset" style={{height: tableHeight}}>
                            {this.createRightActiveContent(tableHeight)}
                        </div>
                    </div>
                </div>

            );
        } else {
            return (<Loader loaded={false} options={LoaderOption}></Loader>);
        }
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
    state.containerTitleMenu.activeContent.map(v=> {
        if (state.common.nowOnContentTarget&&v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
        }
    });
    return ({
        target: target,
        userInfo:state.sideBar.userInfo,
        useSkin: state.common.useSkin,
        defaultToggleStatus: state.common.defaultToggleStatus,
        currentMenu: state.sideBar.menu,
        error:target?target.status.error:undefined,
        ok:target?target.status.ok:undefined
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(ContentSetting);
