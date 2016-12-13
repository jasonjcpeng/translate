import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AppDidMount} from '../action/containers';

class App extends React.Component{
    componentDidMount(){
    }

    render(){
        return (<div>HI</div>);
    }
}

function state(state){
    return ({});
}

function action(dispatch){
    return bindActionCreators({AppDidMount},dispatch);
}

export default connect(state,action)(App);