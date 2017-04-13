/**
 * Created by JasonPeng on 2017/4/2.
 * @param:
 * key:以CheckState作为值，为了在checkState改变后迫使React刷新本组件
 * checkState:boolean 当前选中状态
 * funcOnClick:func 回调函数，回调参数callBackCheckState为改变后的checkState
 */
import React from 'react';
class Checker extends React.Component{
    constructor(props){
        super();
        this.state={
            checkState:props.checkState
        }
    }
    render(){
        return ( <i  onClick={
                            ()=> {
                            this.props.funcOnClick(!this.state.checkState);
                            }
                        }>{function () {
            if (this.state.checkState) {
                return (<i style={(()=>{
                    if(this.props.style){
                        return (this.props.style);
                    }
                })()} className="fa fa-toggle-on"></i>);
            } else {
                return (<i style={(()=>{
                    if(this.props.style){
                        return (this.props.style);
                    }
                })()} className="fa fa-toggle-off"></i>);
            }
        }.bind(this)()}</i>)
    }
}

export default Checker;
