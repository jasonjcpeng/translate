import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionCreators from '../action/app';
import SideBar from '../components/side-bar';
import Header from '../components/header';
import Container from '../components/container';

class App extends React.Component{
    componentWillMount(){
        this.props.AppDidMount();
    }

    componentWillUnmount(){
        clearInterval(this.screenHeightListen);
    }


    renderInit(){
        this.screenHeightListen = setInterval(()=>{
            let windowHeight = window.innerHeight;
            let windowWidth = window.innerWidth;
            if(this.props.windowHeight!==windowHeight||this.props.windowWidth!==windowWidth){
                this.props.screenHeightListenner(windowHeight,windowWidth);
            }
        },100);
        return (<div className="skin-1"><Header/><SideBar/><Container/></div>);
    }

    render(){
        if(this.props.getReady){
            return this.renderInit();
        }else{
            return (<div>Loading!</div>);
        }
    }
}

function state(state){
    return ({
        getReady:state.common.getReady,
        windowHeight:state.common.windowHeight,
        windowWidth:state.common.windowWidth
    });
}

function action(dispatch){
    return bindActionCreators(ActionCreators,dispatch);
}

export default connect(state,action)(App);