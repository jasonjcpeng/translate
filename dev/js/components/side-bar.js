import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/side-bar';

class SideBar extends Component{
    getToggleAnimation(){
        switch (this.props.lastToggleStatus){
            case 'full':
                switch (this.props.toggleStatus){
                    case 'mini':
                        return 'side-bar-full-to-mini';
                        break;
                    case 'none':
                        return 'side-bar-full-to-none';
                        break;
                }
                break;
            case 'mini':
                switch (this.props.toggleStatus){
                    case 'full':
                        return 'side-bar-mini-to-full';
                        break;
                    case 'none':
                        return '';
                        break;
                }
                break;
            case 'none':
                switch (this.props.toggleStatus){
                    case 'full':
                        return 'side-bar-none-to-full';
                        break;
                    case 'mini':
                        return '';
                        break;
                }
                break;
        }
    }

    createItemIcon(item) {
        if(item.icon){
            return (<i className={'fa '+item.icon}></i> );
        }
    }

    createItemActive(v) {
        let active = this.props.sideBar.activeMenu.includes(v);
        return active?'active':'';
    }

    //这个生成动画的方法很蠢，但暂时没有别的办法了
    createToggleAnimationLv(v) {
        let menu = this.props.sideBar.menu;
        if(this.props.sideBar.activeMenu.includes(v)){
            let ChildMenu = menu.filter((val)=> {
                if (val.parentCode == v.code) {
                    return val;
                }
            });
            return ChildMenu.length;
        }else{
            return '';
        }

    }

    isHasChild(menu,code) {
        let newMenu = menu.filter((val)=>{
            if(val.parentCode===code){
                return val;
            }
        });
        if(newMenu.length!==0){
            return true;
        }else{
            return false;
        }

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
                            return (
                                <li className={'toggleOutLv_' + this.createToggleAnimationLv(v) + ' ' + this.createItemActive(v)}
                                    onClick={e=> {
                                this.props.meunItemToggle(v, isHasChild);
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
                    })
                }
            </ul>
        );
    }

    upScroll(e){
        if(this.refs.menu.clientHeight>(this.props.windowHeight-155)&&this.refs.menu.clientHeight+this.props.sideBar.menuScrollY>(this.props.windowHeight-180)){
            this.props.menuScroll(this.props.sideBar.menuScrollY+e);
        }
    }
    downScroll(e){
        if(this.props.sideBar.menuScrollY<0){
            this.props.menuScroll(this.props.sideBar.menuScrollY+e);
        }
    }
    renderNormal(){
        let MenuScroll = {
            top: this.props.sideBar.menuScrollY  + 'px'
        }
        return (
            <div className={"side-bar "+this.getToggleAnimation()} onWheel={e=> {
                if(e.deltaY<0){
                    this.upScroll(e.deltaY/5);
                }else if(e.deltaY>0){
                    this.downScroll(e.deltaY/5);
                }
            }}  >

                <div  className="side-bar-title animation-fadeIn">
                    <div className="side-bar-title-skin ">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="side-bar-title-head-img animation-fadeIn"><img src={this.props.sideBar.userInfo.imgUrl}/></div>
                    <div className="side-bar-title-name animation-fadeIn">{this.props.sideBar.userInfo.name}</div>
                    <div className="side-bar-title-power animation-fadeIn">{this.props.sideBar.userInfo.power}<i className="fa fa-caret-down"></i></div>
                    </div>
                <div ref="menu" className="side-bar-menu" style={MenuScroll} >
                    {this.createNormalMenuItem(this.props.sideBar.menu, '0')}
                </div>

            </div>
        );
    }


    createMiniItemList(){
        return (this.props.sideBar.menu.map(v=>{
            if(v.parentCode==='0'){
                return (<li className={this.createItemActive(v)} key={v.id}>{this.createItemIcon(v)}</li> );
            }
        }));
    }

    renderMini(){
        return (
            <div onClick={e=>{this.props.miniMenuToggle(this.props.defaultToggleStatus,'mini')}} className={"side-bar-toggle "+this.getToggleAnimation()}>
            <div className="side-bar-toggle-menu">
                <ul className="animation-fadeIn">
                    {this.createMiniItemList()}
                </ul>
            </div>
        </div>)
    }

    render(){
        switch (this.props.toggleStatus){
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
        sideBar:state.sideBar,
        defaultToggleStatus: state.common.defaultToggleStatus,
        toggleStatus:state.common.toggleStatus,
        lastToggleStatus:state.common.lastToggleStatus,
        windowHeight:state.common.windowHeight
    });
}

function action(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(state,action)(SideBar);