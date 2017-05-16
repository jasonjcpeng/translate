import React from 'react';
import classnames from 'classnames';

class ModifyShieldCheckBox extends React.Component{
    constructor(props){
        super();
        this.state = {
            itemFieldData:props.itemFieldData,
            apiData:props.itemFieldData.apiData,
            data:props.data,
            onChange:props.onChange
        }
    }

    componentWillReceiveProps(props){
        this.state = {
            itemFieldData:props.itemFieldData,
            apiData:props.itemFieldData.apiData,
            data:props.data,
            onChange:props.onChange
        }
    }

    createCheckBox(){
        if(!this.state.data||Object.prototype.toString.call(this.state.data)==='[object Array]'){
            return this.state.apiData.map((v,k)=>{
                let isChecked = false;
                let checkBoxClassName =classnames({
                    'checkbox':true,
                    'checkbox-checked':(()=>{
                        for(let i=0;i<this.state.data.length;i++){
                            if(this.state.data[i]===v.id){
                                isChecked = true;
                            }
                        }
                        return isChecked;
                    })()
                });
                return <div key={k} onClick={e=>{
                    if(this.state.onChange){
                        let returnData = this.state.data;
                        if(isChecked){
                            returnData = returnData.filter(val=>{
                                if(val!==v.id){
                                    return val;
                                }
                            });
                        }else{
                            returnData.push(v.id)
                        }
                        this.props.onChange(returnData);
                    }
                }} className="check-box"><label>{v.name}</label><div id={v.encode} key={k} className={checkBoxClassName}>
                </div></div>
            });
        }else{
            return <div className="check-box"><label style={{color:'red'}}>多选组件的数据类型应为数组</label></div>
        }


    }

    render(){
        return <div className="check-box-group">{this.createCheckBox()}</div>
    }
}


export default ModifyShieldCheckBox;
