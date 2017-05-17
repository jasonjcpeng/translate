import React from 'react';
//data-pick component
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

/*
 * 时间选择组件
 * config={
 *  title:'',
 *  onChange:()=>{}
 * }
 *  title:notRequired String 输入框前的文字
 *  onChange:Required () 回调值为被选中键值
 * */
class Dater extends React.Component{
    constructor(props) {
        super();
        this.state = {
            title: props.config.title,
            selected:moment(),
            onChange: props.config.onChange
        }
    }

    render(){
        return (<li className="date">
            <span>{this.state.title ? this.state.title : ''}</span>
            <DatePicker selected={this.state.selected}
                        onChange={e=>{
                            this.state.onChange(e.format('YYYY-MM-DDTh:mm:ss'));
                            this.setState({
                                selected:e
                            });
                        }}/>
        </li>);
    }
}

export default Dater;
