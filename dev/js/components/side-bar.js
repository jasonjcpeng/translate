import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/side-bar';

class SideBar extends Component {
    getToggleAnimation() {
        switch (this.props.lastToggleStatus) {
            case 'full':
                switch (this.props.toggleStatus) {
                    case 'mini':
                        return 'side-bar-full-to-mini';
                        break;
                    case 'none':
                        return 'side-bar-full-to-none';
                        break;
                }
                break;
            case 'mini':
                switch (this.props.toggleStatus) {
                    case 'full':
                        return 'side-bar-mini-to-full';
                        break;
                    case 'none':
                        return '';
                        break;
                }
                break;
            case 'none':
                switch (this.props.toggleStatus) {
                    case 'full':
                        return 'side-bar-none-to-full';
                        break;
                    case 'mini':
                        return '';
                        break;
                }
                break;
        }
        return '';
    }

    createItemIcon(item) {
        if (item.icon) {
            return (<i className={'fa '+item.icon}></i> );
        }
    }

    createItemActive(v) {
        let active = this.props.sideBar.activeMenu.filter(val=> {
            if (v === val) {
                return val;
            }
        });
        return active.length > 0 ? 'active' : '';
    }

    //这个生成动画的方法很蠢，但暂时没有别的办法了
    createToggleAnimationLv(v) {
        let menu = this.props.sideBar.menu;
        let isActive = this.props.sideBar.activeMenu.filter(val=> {
            if (v === val) {
                return val;
            }
        });
        if (isActive.length > 0) {
            let ChildMenu = menu.filter((val)=> {
                if (val.parentCode == v.code) {
                    return val;
                }
            });
            return ChildMenu.length;
        } else {
            return '';
        }

    }
    /*判断是否含有子菜单项
    * menu:[] 当前总菜单
    * code:int 这个层级菜单的code即下个菜单的parentCode
    * return:boolean true有子菜单 false无
    * */
    isHasChild(menu, code) {
        let newMenu = menu.filter((val)=> {
            if (val.parentCode === code) {
                return val;
            }
        });
        if (newMenu.length !== 0) {
            return true;
        } else {
            return false;
        }

    }
    /*判断菜单是否含有视图
     * */
    isNoView(MenuItem){
        for(let i in MenuItem.viewPoint){
            return false;
        }
        return true;
    }

    createNormalMenuItem(menu, parentCode) {
        return (
            <ul className="animation-fadeIn">
                {
                    menu.map((v, k)=> {
                        if (parentCode === v.parentCode) {
                            let that = this;
                            let newParentCode = v.code;
                            let newMenu = menu.filter((val, key)=> {
                                if (val !== v) {
                                    return val;
                                }
                            });
                            let isHasChild = this.isHasChild(menu, v.code);
                            let isNoView = this.isNoView(v);
                            if(v.isEnable){
                                return (<li className={'toggleOutLv_' + this.createToggleAnimationLv(v) + ' ' + this.createItemActive(v)}
                                            onClick={e=> {
                                                this.props.meunItemToggle(v, isNoView);
                                                e.stopPropagation();
                                            }} key={v.id}>{this.createItemIcon(v)}
                                    {v.menuName}
                                    {isHasChild ? (
                                        <i className={this.createItemActive(v) ? 'side-bar-menu-arr fa fa-angle-down' : 'side-bar-menu-arr fa fa-angle-left'}></i>) : ''}
                                    {
                                        function () {
                                            if (that.createItemActive(v) && isHasChild) {
                                                return that.createNormalMenuItem(newMenu, newParentCode);
                                            }
                                        }()
                                    }
                                </li>);
                            }
                        }
                    })
                }
            </ul>
        );
    }

    upScroll(e) {
        if (this.refs.menu.clientHeight > (this.props.windowHeight - 205) && this.refs.menu.clientHeight + this.props.sideBar.menuScrollY > (this.props.windowHeight - 230)) {
            this.props.menuScroll(this.props.sideBar.menuScrollY + e);
        }
    }

    downScroll(e) {
        if (this.props.sideBar.menuScrollY < 0) {
            this.props.menuScroll(this.props.sideBar.menuScrollY + e);
        }
    }

    createQuickButton(){
        let createLi = ()=>{
            let quickMenu = this.props.sideBar.userInfo.quickButton.map((v,k)=>{
                for(let i in this.props.sideBar.menu){
                    if(v.id === this.props.sideBar.menu[i].id){
                        return v;
                    }
                }
            });
            if(quickMenu.length!=6){
                let fixNum = 6-quickMenu.length;
                for(let i=0;i<fixNum;i++){
                    quickMenu.push({
                        icon:''
                    });
                }

            }

            return quickMenu.map((v,k)=>{
                let isNoView = this.isNoView(v);
                let className ='fa '+v.icon;
                return <li onClick={e=> {
                    this.props.meunItemToggle(v, isNoView);
                    e.stopPropagation();
                }} key={k}><i className={className}></i></li>
            });
        }
        return (<ul>
            {createLi()}
        </ul>);
    }

    renderNormal() {
        let MenuScroll = {
            top: this.props.sideBar.menuScrollY + 'px'
        }
        let touch = 0;
        return (
            <div className={"side-bar " + this.getToggleAnimation()} onTouchMove={e=> {
                if (touch === 0) {
                    touch = e.changedTouches[0].pageY;
                } else {
                    let move = e.changedTouches[0].pageY - touch;
                    touch = e.changedTouches[0].pageY;
                    if (move < 0) {
                        this.upScroll(move*2);
                    } else if (move > 0) {
                        this.downScroll(move*2);
                    }
                }
            }}
                 onTouchEnd={e=> {
                     touch = 0;
                 }}

                 onWheel={e=> {
                if(e.deltaY<0){
                    this.upScroll(e.deltaY/5);
                }else if(e.deltaY>0){
                    this.downScroll(e.deltaY/5);
                }
            }}>

                <div className="side-bar-title ">
                    <div className="side-bar-tittle-info">
                        <div onClick={()=> {
                            this.props.selectSettingMenu();
                        }} className="side-bar-title-head-img animation-fadeIn"><img
                            src={this.props.sideBar.userInfo.imgUrl}/></div>
                        <div onClick={()=> {
                            this.props.selectSettingMenu();
                        }} className="side-bar-title-name animation-fadeIn">{this.props.sideBar.userInfo.nickName}</div>
                        <div onClick={()=> {
                            this.props.selectSettingMenu();
                        }} className="side-bar-title-power animation-fadeIn">{this.props.sideBar.userInfo.power} <i
                            className="fa fa-cog"></i></div>
                    </div>
                    <div className="side-bar-quick-button">
                            {this.createQuickButton()}
                    </div>

                    <ul className="bg-bubbles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <div ref="menu" className="side-bar-menu" style={MenuScroll}>
                    {this.createNormalMenuItem(this.props.sideBar.menu, '0')}
                </div>
            </div>
        );
    }

    /*递归Mini状态下的菜单内容
    * hoverMenu:[] 现激活（递归剩余）菜单
    * val:{} 当前菜单项
    * return:render
    * */
    createMiniToggleMenuItem(hoverMenu,val) {
        let newMenu = [];
        let style={};

        return hoverMenu.map(v=> {
            if(v.id===val.id){
                newMenu = hoverMenu.filter((filterVal, key)=> {
                    if (filterVal !== v) {
                        return filterVal;
                    }
                });
                if(val.parentCode==0){
                    style={
                        left:'50px'
                    }
                }
                return (<div key={val.code+'_'+v.id} style={style} className="side-bar-toggle-menu-mini-item">
                    <ul>
                        {function(){
                            return this.props.sideBar.menu.map(menu=>{
                                let isHasChild = this.isHasChild(this.props.sideBar.menu,menu.code);
                                let isNoView = this.isNoView(menu);
                                if(menu.parentCode===v.code&&menu.isEnable){
                                    return (<li className='animation-flipInY' key={menu.parentCode+'_'+menu.id}
                                                onMouseEnter={()=>{
                                                    if(isHasChild||hoverMenu.length>1){this.props.miniMenuItemHover(menu);}}}
                                                onClick={(e)=>{
                                                    this.props.meunItemToggle(menu, isNoView);
                                                 e.stopPropagation();
                                                }}
                                        >{menu.menuName}
                                        {isHasChild ? (
                                            <i className={'side-bar-mini-arr fa fa-angle-right'}></i>) : ''}
                                        {this.createMiniToggleMenuItem(newMenu,menu)}
                                    </li> );
                                }
                            });
                        }.bind(this)()}
                    </ul>
                </div> );
            }
        });
    }

    createMiniItemList() {
        return (this.props.sideBar.menu.map(v=> {
            if (v.parentCode === '0'&&v.isEnable) {
                return (<li key={v.id} onMouseEnter={()=> {
                this.props.miniMenuItemHover(v);
                }} onMouseLeave={()=>{
                this.props.miniMenuItemHover('');
                }} onClick={(e)=>{
                    let isNoView = this.isNoView(v);
                    this.props.meunItemToggle(v, isNoView);
                    e.stopPropagation();
                }}
                >{this.createItemIcon(v)}{this.createMiniToggleMenuItem(this.props.sideBar.miniHoverMenu,v)}</li>);
            }
        }));
    }

    renderMini() {
        return (
            <div className={"side-bar-toggle " + this.getToggleAnimation()}>
                <div className="side-bar-toggle-menu">
                    <ul className="animation-fadeIn">
                        <li className="head-li" onClick={()=> {
                        this.props.selectSettingMenu();
                    }}><img className="head-img animation-fadeIn"
                                 src={this.props.sideBar.userInfo.imgUrl}/></li>
                        {this.createMiniItemList()}
                    </ul>
                </div>
            </div>)
    }

    render() {
        switch (this.props.toggleStatus) {
            case 'full':
                return this.renderNormal();
                break;
            case 'mini':
                return this.renderMini();
                break;
            case 'none':
                return (<div style={{width:'0px'}} className={"side-bar "+this.getToggleAnimation()}></div>);
                break;
        }
        return (<div className={"side-bar"}></div>);
    }
}

function state(state) {
    return ({
        sideBar: state.sideBar,
        defaultToggleStatus: state.common.defaultToggleStatus,
        toggleStatus: state.common.toggleStatus,
        lastToggleStatus: state.common.lastToggleStatus,
        windowHeight: state.common.windowHeight
    });
}

function action(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(state, action)(SideBar);