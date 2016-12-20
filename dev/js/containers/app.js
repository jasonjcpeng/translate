import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AppDidMount} from '../action/containers';
import SideBar from '../components/side-bar';

class App extends React.Component{
    componentDidMount(){
        this.props.AppDidMount();
    }

    render(){
        return (<div className="skin-1"><SideBar></SideBar></div>);
    }
}

function state(state){
    return ({});
}

function action(dispatch){
    return bindActionCreators({AppDidMount},dispatch);
}

export default connect(state,action)(App);