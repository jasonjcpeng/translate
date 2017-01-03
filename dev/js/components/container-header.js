import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/container-header';


class ContainerHeader extends Component{
    render(){
        return (
            <header className="header">
                <div className="menu-toggle-button" onClick={()=>{
                    this.props.toggle(this.props.defaultToggleStatus,this.props.toggleStatus);
                }}><i className="fa fa-bars"></i></div>
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


export default connect(state,action)(ContainerHeader);