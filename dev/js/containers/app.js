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

class App extends React.Component{
    componentWillMount(){
        if(window.localStorage.getItem('store')){
            let store = JSON.parse(window.localStorage.getItem('store'));
            this.props.reloadFromLocalStorage(store);
            isOnline?this.props.AppDidMount():'';
        }else{
            this.props.AppDidMount();
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

    render(){
        return <Loader loaded={this.props.loaded} options={LoaderOption}>
            {this.renderInit()}
        </Loader>
    }
}

function state(state){
    return ({
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