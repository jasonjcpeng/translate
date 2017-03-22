import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/content-setting';
//Component
import OptionBar from '../option-bar';
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
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
        let height = tableHeight - 50;
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            {this.createActiveContentHeader(rightActiveContent)}
            <div style={{height: height}} className="content-setting-frame">
                <div className="standard-ul">
                    <ul>
                        <li><span>姓名</span><input type="text"/></li>
                        <li><span>权限</span><input type="text"/></li>
                    </ul>
                </div>
            </div>
        </div>);
    }

    createTel(rightActiveContent, tableHeight) {
        let height = tableHeight - 50;
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            <div style={{height: height}} className="content-setting-frame">
                {this.createActiveContentHeader(rightActiveContent)}
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

    quickSort(arr, root = {code: '0'}, result = []) {
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

            return result;
        }
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
        return menu.map((m, k)=> {
            for (let i in toggleCode) {
                if (m.parentCode === toggleCode[i]) {
                    let textIndent = 0;
                    for (let space = 0; space < i; space++) {
                        textIndent += 20;
                    }
                    return (<tr className={function(){
                        if(this.props.target.status.selectMenuSettingTableItem&&this.props.target.status.selectMenuSettingTableItem.id===m.id){
                            return 'active';
                        }
                    }.bind(this)()} onClick={()=>{
                        this.props.selectSingleMenuItem(m);
                    }} key={m.id + '_' + k} style={{display: ''}}>
                        <td>{k + 1}</td>
                        <td style={{textAlign:'left',textIndent:textIndent}}>{m.menuName}{function () {
                            if (this.isMenuHasChild(menu, m)) {
                                return (<i style={{float:'right'}} onClick={
                                    (e)=>{
                                        this.props.toggleSingleMenuItem(m.code);
                                        e.stopPropagation();
                                    }
                                }
                                           className={this.isSingleMenuSettingTableToggle(toggleCode,m.code)? 'menu-toggle fa fa-caret-down' : 'menu-toggle fa fa-caret-right'}></i>)
                            }
                        }.bind(this)()}</td>
                        <td ><i className={'fa ' + m.icon}></i></td>
                        <td onClick={
                            (e)=> {
                                let obj = m;
                                obj.isEnable = !m.isEnable;
                                this.props.changeMenuSetting(obj);
                                e.stopPropagation();
                            }
                        }>{function () {
                            if (m.isEnable) {
                                return (<i className="fa fa-toggle-on"></i>);
                            } else {
                                return (<i className="fa fa-toggle-off"></i>);
                            }
                        }.bind(this)()}</td>
                        <td>{m.menuSort}</td>
                        <td></td>
                    </tr>);
                }
            }

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
                            ()=>{
                                this.props.toggleOffAllMenuItem();
                            }
                        } className="right-button"><i className="fa fa-reply-all"></i>&nbsp;全部收起
                        </li>
                        <li className="first-child" onClick={()=>{
                            menuSettingOption.add.targetMenu = '0';
                             this.props.openOption(menuSettingOption.add);
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
                            ()=>{
                                this.props.toggleOffAllMenuItem();
                            }
                        } className="right-button"><i className="fa fa-reply-all"></i>&nbsp;全部收起
                        </li>
                        <li className="first-child" onClick={()=>{
                            menuSettingOption.add.targetMenu = this.props.target.status.selectMenuSettingTableItem;
                            this.props.openOption(menuSettingOption.add);
                        }}><i className="fa fa-plus"></i>&nbsp;新增
                        </li>
                        <li onClick={()=>{
                            menuSettingOption.edit.targetMenu = this.props.target.status.selectMenuSettingTableItem;
                            this.props.openOption(menuSettingOption.edit);
                        }}><i className="fa fa-pencil-square-o"></i>&nbsp;编辑
                        </li>
                        <li onClick={()=>{
                            menuSettingOption.detail.targetMenu = this.props.target.status.selectMenuSettingTableItem;
                            this.props.openOption(menuSettingOption.detail);
                        }}><i className="fa fa-columns"></i>&nbsp;详细
                        </li>
                        <li onClick={
                            ()=>{
                                this.props.optionDeleteMenu(this.props.target.status.selectMenuSettingTableItem);
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
        return (<div key={rightActiveContent.key} className=" right-active-content animation-fadeInRight ">
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
                            <th style={{width:'60px'}}>有效</th>
                            <th style={{width:'100px'}}>菜单种类</th>
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
        }, {key: 'password', name: '修改密码'}, {key: 'skin', name: '设置皮肤'}];
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
        if (v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
        }
    });
    return ({
        target: target,
        useSkin: state.common.useSkin,
        defaultToggleStatus: state.common.defaultToggleStatus,
        currentMenu: state.sideBar.menu,
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(ContentSetting);
