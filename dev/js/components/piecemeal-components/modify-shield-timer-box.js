import React from 'react';
import classnames from 'classnames';
//data-pick component
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class ModifyShieldTimerBox extends React.Component{
    constructor(props){
        super();
        this.state = {
            itemFieldData:props.itemFieldData,
            apiData:props.itemFieldData.apiData,
            data:props.data,
            onChange:props.onChange,
            disabled:props.itemFieldData.isDisable
        }
    }

    componentWillReceiveProps(props){
        this.state = {
            itemFieldData:props.itemFieldData,
            apiData:props.itemFieldData.apiData,
            data:props.data,
            onChange:props.onChange,
            disabled:props.itemFieldData.isDisable
        }
    }

    createTimer(){
        let enableClassName = classnames({
            'timer-disable':this.state.disabled
        });
        let selected = this.state.data?moment(this.state.data):'';
       if(!this.state.data||Object.prototype.toString.call(this.state.data)==='[object String]'){
           if(this.state.disabled){
               return <input disabled="disabled" type="text" value={moment(this.state.data).format('MM/DD/YYYY')}/>
           }else{
               return <DatePicker selected={selected}
                                  onChange={e=>{
                                      this.state.onChange(e.format('YYYY-MM-DDTh:mm:ss'));
                                  }}/>
           }

        }else{
            return <div className="check-box"><label style={{color:'red'}}>下拉选择组件的数据类型应为字符串</label></div>
        }
    }

    render(){
        return <div className="check-box-group">{this.createTimer()}</div>
    }
}


export default ModifyShieldTimerBox;
