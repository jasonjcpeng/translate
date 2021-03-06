import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/header';
import * as IMG from '../config/logo-img-base64';



class Header extends Component{
    handleExitApp(){
        window.localStorage.removeItem('store');
        window.localStorage.removeItem('login');
        window.localStorage.removeItem('ueditor_preference');
        var browserName=navigator.appName;
        if (browserName=="Netscape") {
            window.open('','_self','');
            window.close();
        } else {
            window.close();
        }
    }
    render(){
        return (
            <header className="header">
                <div className="menu-toggle-button" onClick={()=>{
                    this.props.toggle(this.props.defaultToggleStatus,this.props.toggleStatus);
                }}><i className="fa fa-bars"></i></div>
                <div className="header-exit" onClick={e=>{
                this.handleExitApp();
                }}><i className="fa fa-power-off"></i></div>
                <div className="header-logo"><img src={IMG.Logo} alt="logo"/></div>
            </header>
        );
    }
}

function state(state) {
    return ({
        defaultToggleStatus:state.common.defaultToggleStatus,
        toggleStatus:state.common.toggleStatus
    })
}

function action(dispatch) {
    return bindActionCreators(ActionCreators,dispatch);
}


export default connect(state,action)(Header);