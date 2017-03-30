import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionCreators from '../action/app';
import Loader from 'react-loader';
import {LoaderOption} from '../config/config';
import SideBar from '../components/side-bar';
import Header from '../components/header';
import Container from '../components/container';

class App extends React.Component{
    componentWillMount(){
        let userName = 'admin';
        let psw = '000';
        this.props.appLogin(userName,psw);
    }

    componentInit(){
        let flag = false;
        let store = JSON.parse(window.localStorage.getItem('store'));
        if(!store){
            console.log("no store");
            flag = true;
        }else if(store.common.error){
            console.log("error");
            flag = true;
        }
        if(flag){
            this.props.AppDidMount();
        }else{
            this.props.reloadFromLocalStorage(store);
        }

    }

    componentWillUnmount(){
        clearInterval(this.screenHeightListen);
    }


    renderInit(){
        if(this.props.error){
            return (<div>{this.props.error}</div>);
        }else{
            this.screenHeightListen = setInterval(()=>{
                let windowHeight = window.innerHeight;
                let windowWidth = window.innerWidth;
                if(this.props.windowHeight!==windowHeight||this.props.windowWidth!==windowWidth){
                    this.props.screenHeightListenner(windowHeight,windowWidth);
                }
            },100);
            return (<div className={this.props.useSkin}><Header/><SideBar/><Container/></div>);
        }

    }

    isLogin(){
        if(this.props.isLogin){
            return <Loader loaded={this.props.loaded} options={LoaderOption}>
                {this.renderInit()}
            </Loader>
        }else{
            return <div></div>
        }
    }

    render(){
        return this.isLogin();
    }
}

function state(state){
    return ({
        isLogin:state.common.isLogin,
        useSkin:state.common.useSkin,
        loaded:state.common.loaded,
        error:state.common.error,
        windowHeight:state.common.windowHeight,
        windowWidth:state.common.windowWidth
    });
}

function action(dispatch){
    return bindActionCreators(ActionCreators,dispatch);
}

export default connect(state,action)(App);