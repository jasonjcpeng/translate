import React from 'react';
import classnames from 'classnames';

class ModifyShieldRadioBox extends React.Component{
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

    createRadioBox(){
        if(!this.state.apiData){
            return <div className="check-box"><label style={{cursor:'default',color:'red'}}>单选组件未设置数据字典</label></div>
        }else if(!this.state.data||Object.prototype.toString.call(this.state.data)==='[object String]'){
            return this.state.apiData.map((v,k)=>{
                let isChecked = false;
                let checkBoxClassName =classnames({
                    'radio-disable':this.state.disabled,
                    'radio':true,
                    'radio-checked':(()=>{
                            if(this.state.data===v.id){
                                isChecked = true;
                            }
                        return isChecked;
                    })()
                });
                return <div key={k} onClick={e=>{
                    if(this.state.onChange){
                        this.props.onChange(v.id);
                    }
                }} className="check-box"><label>{v.name}</label><div id={v.encode} key={k} className={checkBoxClassName}>
                </div></div>
            });
        }else{
            return <div className="check-box"><label style={{color:'red'}}>单选组件的数据类型应为字符串</label></div>
        }


    }

    render(){
        return <div className="check-box-group">{this.createRadioBox()}</div>
    }
}


export default ModifyShieldRadioBox;
