import React from 'react';

class ModifyShield extends React.Component{
    constructor(props){
        super();
        this.state={
            isShow:props.isShow,
            fieldData:props.fieldData
        }
    }

    createFieldStructure(){
        let createItem = ()=>{
            let choiceClassName = (isMultiColumns)=>{
                return isMultiColumns?'multiple-item':'single-item';
            }


            return this.state.fieldData.map((val,key)=>{
                let style ={
                        width:val.width
                }
                if(val.isEnable){
                    return (<li key={key} style={style} className={choiceClassName()}>{val.CNName}</li>);
                }
            });
        }

        return (<div className="shield-modify-content">
            <ul>
                {createItem()}
            </ul>
        </div>)
    }

    render(){
        if(this.state.isShow){
            return (<div className="shield">
                <div className="shield-modify">
                    {this.createFieldStructure()}
                </div>
            </div>)
        }else{
            return (<div></div>);
        }
    }
}

export default ModifyShield;
