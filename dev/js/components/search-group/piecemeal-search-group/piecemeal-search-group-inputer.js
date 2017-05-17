import React from 'react';

/*
 * 输入框组件
 * config={
 *  title:'',
 *  placeholder:'',
 *  onChange:()=>{}
 * }
 *
 *  title:notRequired String 输入框前的文字
 *  placeholder:notRequired String placeholder文字
 *  onChange:Required () 回调值为被选中键值
 * */
class Inputer extends React.Component{
    constructor(props) {
        super();
        this.state = {
            title: props.config.title,
            placeholder:props.config.placeholder,
            onChange: props.config.onChange
        }
    }

    render(){
        return (<li className="input">
            <span>{this.state.title ? this.state.title : ''}</span>
            <input placeholder={this.state.placeholder?this.state.placeholder:''} onChange={e=>{
                this.state.onChange(e.target.value);
                this.setState({
                    value: e.target.value
                });
                e.stopPropagation();
            }} type="text"/>
        </li>);
    }
}

export default Inputer;
