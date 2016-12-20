import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class SideBar extends Component{
    createMenuItem(){
        return this.props.sideBar.userMenu.map((v,k)=>{
            if(v.item_2){
                return (<li key={'userMenu-item_1-'+k}><i className={'fa '+v.icon}></i>{v.item_1.content}<i className="side-bar-menu-arr fa fa-angle-left"></i></li>);
            }else{
                return (<li key={'userMenu-item_1-'+k}><i className={'fa '+v.icon}></i>{v.item_1.content}</li>);
            }
        });
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
                <ul>
                    {this.createMenuItem()}
                </ul>
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
    return bindActionCreators({},dispatch);
}

export default connect(state,action)(SideBar);