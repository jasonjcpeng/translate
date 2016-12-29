import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/CONSTANTS';


class ContainerHeader extends Component{
    render(){
        return (
            <header className="header">
                <div className="menu-toggle-button" onClick={e=>{}}><i className="fa fa-bars"></i></div>
            </header>
        );
    }
}

function state(state) {
    return ({
    })
}

function action(dispatch) {
    return bindActionCreators(ActionCreators,dispatch);
}


export default connect(state,action)(ContainerHeader);