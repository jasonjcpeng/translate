import React from 'react';

/*
 * 下拉组件
 * config={
 *  options:[],
 *  selected:'',
 *  title:'',
 *  defaultOptionName:'',
 *  onChange:()=>{}
 * }
 *
 *  options:Required [] 选项内容 {key:'键值',name:'显示的名称'}
 *  selected:Required String 初始被选中的键值，空则为默认空选项
 *  title:notRequired String 下拉框前的文字
 *  defaultOptionName:notRequired String 空选项的内容
 *  onChange:Required () 回调值为被选中键值
 * */
class Selector extends React.Component {
    constructor(props) {
        super();
        this.state = {
            title: props.config.title,
            options: props.config.options,
            selected: props.config.selected,
            defaultOptionName: props.config.defaultOptionName,
            onChange: props.config.onChange
        }
    }

    createOptions() {
        return this.state.options.map((v, k)=> {
            return <option key={k} value={v.key}>{v.name}</option>
        });
    }

    render() {
        return (<li className="select">
            <span>{this.state.title ? this.state.title : ''}</span>
            <select onChange={e=> {
                this.state.onChange(e.target.value);
                this.setState({
                    selected:e.target.value
                });
                e.stopPropagation();
            }} defaultValue={this.state.selected}>
                <option key={'null'} value="">{this.state.defaultOptionName ? this.state.defaultOptionName : '请选择'}</option>
                {this.createOptions()}
            </select>
        </li>);
    }
}

export default Selector;
