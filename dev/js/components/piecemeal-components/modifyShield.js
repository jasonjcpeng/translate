import React from 'react';
//json
import ComponentType from '../../../jsons/modify-shield-component-type.json';


/*
* @param
* isShow:boolean 必填 是否显示本遮罩层，与Redux组件桥接
* fieldData:[] 必填 本组件所包含字段数组
* data:{} 可选 来自菜单的某选中项详细数据
* onChange:() 必填 菜单内修改事件响应回调，用以转传入Redux。
* onCancel:() 可选 关闭遮罩的回调，如没有则不显示取消按钮
* onFinish:() 可选 完成修改的回调，如没有则不显示确定按钮
*
* */
class ModifyShield extends React.Component{
    constructor(props){
        super();
        this.state={
            isShow:props.isShow,
            fieldData: props.fieldData,
            onCancel: props.onCancel,
            onFinish: props.onFinish
        }
    }

    createFieldStructure(){
        let createItem = ()=>{
            let choiceClassName = (isMultiColumns)=>{
                return isMultiColumns?'multiple-item':'single-item';
            }
            let createNormalInput = (val)=> {
                return (<div>{val.CNName}:<input style={{width: val.componentWidth + '%'}} type="text"/></div>);
            }

            let createItemComponent = (val)=> {
                switch (val.componentType) {
                    case 'input':
                        return (createNormalInput(val));
                        break;
                    case 'checkBox':
                        return <div></div>
                        break;
                }
            }

            return this.state.fieldData.map((val,key)=>{
                let style ={
                    width: (val.width + '%')
                }

                if(val.isEnable){
                    if (!val.isMultiColumns) {
                        //用以清除浮动
                        if (this.state.fieldData[key - 1] && this.state.fieldData[key - 1].isMultiColumns) {
                            return (<div>
                                <div style={{clear: 'both'}}></div>
                                <li key={key} style={style}
                                    className={choiceClassName(val.isMultiColumns)}>{createItemComponent(val)}</li>
                            </div>)
                        } else {
                            return (<li key={key} style={style}
                                        className={choiceClassName(val.isMultiColumns)}>{createItemComponent(val)}</li>);
                        }
                    } else {
                        return (<li key={key} style={style}
                                    className={choiceClassName(val.isMultiColumns)}>{createItemComponent(val)}</li>);
                    }
                }
            });
        }

        return (<div className="shield-modify-content">
            <ul>
                {createItem()}
            </ul>
        </div>)
    }

    createFooter() {
        let createCancelButton = ()=> {
            if (this.state.onCancel) {
                return (<button onClick={()=> {
                    this.state.onCancel()
                }} className="btn">取消</button>);
            }
        }

        let createFinishButton = ()=> {
            if (this.state.onFinish) {
                return (<button onClick={()=> {
                }} className="btn btn-finish">确定</button>);
            }
        }

        return (<div className="shield-modify-footer">{createCancelButton()}{createFinishButton()}</div>)
    }


    render(){
        if(this.state.isShow){
            return (<div className="shield">
                <div className="shield-modify">
                    {this.createFieldStructure()}
                    {this.createFooter()}
                </div>
            </div>)
        }else{
            return (<div></div>);
        }
    }
}

export default ModifyShield;
