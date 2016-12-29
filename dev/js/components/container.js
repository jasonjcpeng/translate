import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ContainerTittleMenu from './container-title-menu';
import ContainerHeader from './container-header';
import * as ActionCreators from '../action/side-bar';

class Container extends Component {
    render() {
        this.isCreateScrollBar = this.props.toggleStatus === 'full'?true:false;
        let contentHeight = this.props.windowHeight - 93+(this.isCreateScrollBar?0:42);
        return (<div className="container">
            <ContainerHeader/>
            <ContainerTittleMenu/>
            <section className="content" style={{height: contentHeight}}>
            </section>
        </div>);
    }
}

function state(state) {
    return ({
        windowHeight: state.common.windowHeight,
        windowWidth: state.common.windowWidth,
        toggleStatus:state.common.toggleStatus
    });
}


function action(dispatch) {
    return bindActionCreators({}, dispatch);
}


export default connect(state, action)(Container);
