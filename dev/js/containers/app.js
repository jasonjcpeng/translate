import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AppDidMount} from '../action/containers';
import SideBar from '../components/side-bar';

class App extends React.Component{
    componentDidMount(){
        this.props.AppDidMount();
    }

    renderInit(){
        return (<div className="skin-1"><SideBar></SideBar></div>);
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
        getReady:state.common.getReady
    });
}

function action(dispatch){
    return bindActionCreators({AppDidMount},dispatch);
}

export default connect(state,action)(App);