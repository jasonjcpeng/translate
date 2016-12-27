import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as ActionCreators from '../action/side-bar';

class SideBar extends Component{
    componentDidMount() {
        const windowHeight = window.innerHeight;
        const menuHeight = this.refs.menu.offsetHeight;
    }

    createItemIcon(item) {
        if(item.icon){
            return (<i className={'fa '+item.icon}></i> );
        }
    }

    createItemActive(id) {
        let active = this.props.sideBar.activeMenuId.includes(id);
        return active?'active':'';
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

    createAllNormalMenuItem(menu, parentCode) {
        return (<ul >
            {
                menu.map((v,k)=>{
                    if(parentCode===v.parentCode){
                        let newParentCode = v.code;
                        let newMenu = menu.filter((val,key)=>{
                            if(val!==v){
                                return val;
                            }
                        });
                        return (<li key={parentCode+'_'+v.id}>{this.createItemIcon(v)}
                            {v.menuName}
                            {this.createItemArr(menu,v.code)}
                            {this.createNormalMenuItem(newMenu,newParentCode)}
                        </li>);
                    }
                })
            }
        </ul> );
    }

    createNormalMenuItem(menu, parentCode) {
        return (<ul >
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
                        let isHasChild = this.isHasChild(menu,v.code);
                        return (<li className={this.createItemActive(v.id)} onClick={e=> {
                            this.props.meunItemToggle(v.parentCode, v.id,isHasChild);
                            e.stopPropagation();
                        }} key={v.id}>{this.createItemIcon(v)}
                            {v.menuName}
                            {isHasChild?(<i className="side-bar-menu-arr fa fa-angle-left"></i>):''}
                            {
                                function(){
                                    if(that.createItemActive(v.id)&&isHasChild){
                                       return that.createNormalMenuItem(newMenu,newParentCode);
                                    }
                                }()
                            }
                        </li>);
                    }
                })
            }
        </ul>);
    }


    renderNormal(){
        let MenuScroll = {
            top: this.props.sideBar.menuScrollY + 'px'
        }
        return (<div className="side-bar">
            <div className="side-bar-title animation-fadeIn">
                <div className="side-bar-title-skin">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="side-bar-title-head-img"><img src={this.props.sideBar.userInfo.imgUrl} /></div>
                <div className="side-bar-title-name">{this.props.sideBar.userInfo.name}</div>
                <div className="side-bar-title-power">{this.props.sideBar.userInfo.power}<i className="fa fa-caret-down"></i></div>
            </div>
            <div ref="menu" className="side-bar-menu animation-fadeIn" style={MenuScroll} onWheel={e=> {
                let top = this.props.sideBar.menuScrollY - e.deltaY / 5;
                let menuHeight = this.refs.menu.offsetHeight;
                if (top <= 0 && menuHeight + top + 200 >= window.innerHeight) {
                    this.props.menuScroll(top);
                }
            }}>
                {this.createNormalMenuItem(this.props.sideBar.menu, '0')}
            </div>
        </div>);
    }

    render(){
        return this.renderNormal();
    }
}

function state(state) {
    return ({
        sideBar:state.sideBar
    });
}

function action(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(state,action)(SideBar);