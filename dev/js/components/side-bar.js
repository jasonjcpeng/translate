import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as ActionCreators from '../action/side-bar';

class SideBar extends Component{
    createItemIcon(item) {
        if(item.icon){
            return (<i className={'fa '+item.icon}></i> );
        }
    }

    createItemArr(menu,code) {
        let newMenu = menu.filter((val)=>{
            if(val.parentCode===code){
                return val;
            }
        });
        if(newMenu.length!==0){
            return (<i className="side-bar-menu-arr fa fa-angle-right"></i>  );
        }

    }

    createNormalMenuItem(menu, parentCode) {
        return (<ul>
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

    renderNormal(){
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
            <div className="side-bar-menu animation-fadeIn">
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