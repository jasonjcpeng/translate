/**
 * Created by JasonPeng on 2017/3/8.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/option-bar'
import classNames from 'classnames';


class OptionBar extends Component {
    constructor(props) {
        super(props);
        if(props.state){
            this.state=props.state
        }else{
            this.state={
                a:'nb'
            }
        }
    }

    test() {
        this.state={
            a:'change'
        }
        this.props.setStateBack(this.state);
    }

    render() {
        console.log(this.state);
        return (<div className="component-option-bar">
            <ul>
                <li onClick={()=>{

                this.test();
                }}><i className="fa fa-plus"></i>&nbsp;新增
                </li>
                <li><i className="fa fa-pencil-square-o"></i>&nbsp;编辑</li>
                <li><i className="fa fa-columns"></i>&nbsp;详细</li>
                <li><i className="fa fa-trash-o"></i>&nbsp;删除</li>
            </ul>
        </div>);
    }
}

OptionBar.defaultProps = {
    a: 'a'
}


const action = (dispatch)=> {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect()(OptionBar);