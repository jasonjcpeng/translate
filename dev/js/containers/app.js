import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionCreators from '../action/app';
import Loader from 'react-loader';
import {LoaderOption} from '../config/config';
import SideBar from '../components/side-bar';
import Header from '../components/header';
import Container from '../components/container';
import {isOnline} from '../config/config';
import ShieldAlert from '../components/piecemeal-components/shield-alert';

class App extends React.Component{
    componentWillMount(){
        this.componentInit();
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
        if(!flag){
            this.props.reloadFromLocalStorage(store);
        }
        if(isOnline){
            this.props.AppDidMount();
        }else if(flag){
            this.props.AppDidMount();
        }

    }

    componentWillUnmount(){
        clearInterval(this.screenHeightListen);
    }

    createReloadShield(){
        if(this.props.isReload){
            return <div className="app-reloading"></div>
        }else{
            return <div></div>
        }
    }

    renderInit(){
        if(this.props.error){
            return (<ShieldAlert targetType="app" onTargetMenuTarget="" content={this.props.error} title="哇！崩溃啦！去找后台小哥吧！"></ShieldAlert>);
        }else{
            this.screenHeightListen = setInterval(()=>{
                let windowHeight = window.innerHeight;
                let windowWidth = window.innerWidth;
                if(this.props.windowHeight!==windowHeight||this.props.windowWidth!==windowWidth){
                    this.props.screenHeightListenner(windowHeight,windowWidth);
                }
            },100);
            return (<div className={this.props.useSkin}>{this.createReloadShield()}<Header/><SideBar/><Container/></div>);
        }

    }

    render(){
        return <Loader loaded={this.props.loaded} options={LoaderOption}>
            {this.renderInit()}
        </Loader>
    }
}

function state(state){
    return ({
        isReload:state.common.isReload,
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