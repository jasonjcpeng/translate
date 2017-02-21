import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/content-setting';

import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';

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

    createBaseInfo(rightActiveContent) {
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            {this.createActiveContentHeader(rightActiveContent)}
            <ul>
                <li><span>姓名</span><input type="text"/></li>
                <li><span>权限</span><input type="text"/></li>
            </ul>
        </div>);
    }

    createTel(rightActiveContent) {
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            {this.createActiveContentHeader(rightActiveContent)}
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

    createSkin(rightActiveContent) {
        let arr = [{key: 'skin-1', img: '#3399cc'}, {key: 'skin-2', img: 'pink'}, {key: 'skin-3', img: 'green'}];
        return (<div key={rightActiveContent.key} className="right-active-content animation-fadeInRight">
            {this.createActiveContentHeader(rightActiveContent)}
            <div className="skin-group">
                {this.createSkinItem(arr)}
            </div>
        </div>);
    }

    createRightActiveContent() {
        let rightActiveContent = this.props.target.status.rightActiveContent;
        switch (rightActiveContent.key) {
            case 'baseInfo':
                return this.createBaseInfo(rightActiveContent);
                break;
            case 'tel':
                return this.createTel(rightActiveContent);
                break;
            case 'skin':
                return this.createSkin(rightActiveContent);
                break;
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
                            {this.createRightActiveContent()}
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
        defaultToggleStatus: state.common.defaultToggleStatus
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(ContentSetting);
