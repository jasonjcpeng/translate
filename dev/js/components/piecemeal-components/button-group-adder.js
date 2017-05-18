/**
 *
 * Created by JasonPeng on 2017/4/22.
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
        this.state = {
            targetID:props.targetID,
            isShow: props.isShow,
            fieldData: props.fieldData,
            onCancel: props.onCancel,
            onFinish: props.onFinish,
            onChange: props.onChange,
            initData: props.initData
        }
    }


    render() {
        return (
            <ModifyShield disabled={false} targetID={this.state.targetID} isShow={this.state.isShow} data={this.state.initData} fieldData={this.state.fieldData}
                          onCancel={e=>{
                    this.state.onCancel(e);
                }}
                          onFinish={(()=>{
                    if(this.state.onFinish){
                    return (e)=>{
                            this.state.onFinish(e);
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