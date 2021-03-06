/**
 *  批量删除
 * Created by JasonPeng on 2017/4/21.
 */
import React from 'react';

class ButtonGroupBatchDeleter extends React.Component{
    constructor(props){
        super();
        this.state={
            isShow: props.isShow,
            deleteFunc:props.deleteFunc
        }

    }
    componentWillMount(){
        this.state.deleteFunc();
    }

    render(){
        return <div key={this.state.isShow}></div>
    }
}

export default ButtonGroupBatchDeleter;