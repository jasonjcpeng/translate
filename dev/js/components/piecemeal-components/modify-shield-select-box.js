import React from 'react';
import classnames from 'classnames';

/*
*
* 修改遮罩层中的下来组件
*
* */
class ModifyShieldSelectBox extends React.Component{
    constructor(props){
        super();
        this.state = {
            itemFieldData:props.itemFieldData,
            apiData:props.itemFieldData.apiData,
            data:props.data,
            onChange:props.onChange,
            disabled:props.itemFieldData.isDisable||props.disabled
        }
    }

    componentWillReceiveProps(props){
        this.state = {
            itemFieldData:props.itemFieldData,
            apiData:props.itemFieldData.apiData,
            data:props.data,
            onChange:props.onChange,
            disabled:props.itemFieldData.isDisable||props.disabled
        }
    }

    createSelector(){
        if(!this.state.apiData){
            return <div className="check-box"><label style={{cursor:'default',color:'red'}}>下拉选择组件未设置数据字典</label></div>
        }else if(!this.state.data||Object.prototype.toString.call(this.state.data)==='[object String]'){
            return <select disabled={this.state.disabled} onChange={e=>{
                if(this.state.onChange){
                    this.props.onChange(e.target.value);
                }
            }} value={this.state.data}>{this.state.apiData.map((v,k)=>{
                return <option  key={k} value={v.id}>{v.name}</option>
            })}</select>
        }else{
            return <div className="check-box"><label style={{color:'red'}}>下拉选择组件的数据类型应为字符串</label></div>
        }
    }

    render(){
        return <div className="check-box-group">{this.createSelector()}</div>
    }
}


export default ModifyShieldSelectBox;
