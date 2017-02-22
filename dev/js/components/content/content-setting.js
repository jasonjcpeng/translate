import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/content-setting';

import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';

import SkinList from '../../../jsons/skin-list.json';

class ContentSetting extends React.Component {
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
            <ul>
                <li><span>姓名</span><input type="text"/></li>
                <li><span>权限</span><input type="text"/></li>
            </ul>
            </div>
        </div>);
    }

    createTel(rightActiveContent,tableHeight) {
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


    createMenuSettingTableBody() {
        return this.props.currentMenu.map((m, k)=> {
            return (<tr key={k} style={{display: ''}}>
                <td key={m.id + '_' + k}>{k + 1}</td>
                <td>{m.menuName}</td>
                <td><i className={'fa ' + m.icon}></i></td>
                <td>{m.api}</td>
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
        });
    }

    createMenuSetting(rightActiveContent, tableHeight) {
        let height = tableHeight - 100;
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            {this.createActiveContentHeader(rightActiveContent)}
            <div className="content-setting-header">header</div>
            <div style={{height: height}} className="content-setting-frame">
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        <th>名称</th>
                        <th>图标</th>
                        <th>API</th>
                        <th>有效</th>
                        <th>菜单种类</th>
                        <th>介绍</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.createMenuSettingTableBody()}
                    </tbody>
                </table>
            </div>
        </div>);
    }

    createRightActiveContent(tableHeight) {
        let rightActiveContent = this.props.target.status.rightActiveContent;
        switch (rightActiveContent.key) {
            case 'baseInfo':
                return this.createBaseInfo(rightActiveContent,tableHeight);
                break;
            case 'tel':
                return this.createTel(rightActiveContent,tableHeight);
                break;
            case 'skin':
                return this.createSkin(rightActiveContent,tableHeight);
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
                         style={{width:'20%',float:'left',marginLeft:'1%'}}>
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
                         style={{width:'75%',float:'right',marginRight:'1%'}}>
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
        currentMenu: state.sideBar.menu
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(ContentSetting);
