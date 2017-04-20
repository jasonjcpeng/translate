/**
 *
 * Created by JasonPeng on 2017/4/20.
 */
import React from 'react';
import ModifyShield from '../piecemeal-components/modifyShield';

/*
 * @param
 * isShow:boolean 必填 是否显示本遮罩层，与Redux组件桥接
 * fieldData:[] 必填 本组件所包含字段数组
 * initData:{} 必填 来自菜单的某选中项详细数据
 * reduxSaveData:{} 必填 Redux传入本组件双向绑定的基本数据
 * onChange:() 可选 菜单内修改事件响应回调，用以转传入Redux。
 * onCancel:() 必填 关闭遮罩的回调，如没有则不显示取消按钮
 * onFinish:() 必填 完成修改的回调，如没有则不显示确定按钮
 *
 * */
class ButtonGroupModifier extends React.Component {
    constructor(props) {
        super();
        let reduxSaveData = (()=> {
            if (props.reduxSaveData) {
                return props.reduxSaveData;
            } else {
                let temp = {};
                for (let i in props.initData) {
                    temp[i] = props.initData[i];
                }
                return temp;
            }
        })();

        this.state = {
            data: props.data ? props.data : {},
            isShow: props.isShow,
            fieldData: props.fieldData,
            onCancel: props.onCancel,
            onFinish: props.onFinish,
            reduxSaveData: reduxSaveData,
            onChange: props.onChange
        }
    }


    render() {
        return (
            <ModifyShield isShow={this.state.isShow} data={this.state.reduxSaveData} fieldData={this.state.fieldData}
                          onCancel={e=>{
                    this.state.onCancel(e);
                }}
                          onChange={(()=>{
                    if(this.state.onChange){
                    return ()=>{
                            this.state.onChange(data);
                        }
                    }else{
                    return undefined
                    }
                    })()
                    }
                          onFinish={(()=>{
                    if(this.state.onFinish){
                    return ()=>{
                            this.state.onFinish(this.state.reduxSaveData);
                        }
                    }else{
                    return undefined
                    }
                    })()
                    }
            ></ModifyShield>);
    }
}

export default ButtonGroupModifier;