import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Constants from '../../action/CONSTANTS';

class ModifySearchGroupConfig extends React.Component{
    constructor(props){
        super();
        this.state ={
            target:props.target,
            allData:props.config,
            tableData:props.tableData
        }
    }

    componentWillMount(){
        this.props.actionDidMount(this.state.target);
    }

    componentWillReceiveProps(props){
        this.state ={
            target:props.target,
            allData:props.config,
            tableData:props.tableData
        }
    }
    createContent(){
        let createFieldList = ()=> {
            let handleOnClick = (item)=> {
                let dataHasCreated = this.props.dataHasCreated;
                dataHasCreated.push(item);
                this.props.actionSaveDataHasCreated(this.state.target,dataHasCreated);
            }
            return this.state.tableData.map((v, k)=> {
                let flag = true;
                for (let i in this.props.dataHasCreated) {
                    if (this.props.dataHasCreated[i].name === v.name) {
                        flag = false;
                    }
                }
                if (flag) {
                    return (<li onClick={()=>{
                        let singleItem = {
                            name:v.name,
                            CNName: v.CNName,
                            api:''
                        };
                        handleOnClick(singleItem);
                    }
                    } key={k}>{v.name}</li>);
                }
            });
        }

        return (<div>
            <div className="field-list">
                <ul>{createFieldList()}</ul>
            </div>
            {}
        </div>);
    }

    render(){
        console.log(this.state.tableData)
        console.log(this.state.allData);
        console.log(this.props.targetObject);
        if(this.state.allData){
            return (<div className="shield">
                <div className="shield-modify">
                    <div className="shield-modify-content-search-group">
                        {this.createContent()}
                    </div>
                    <div className="shield-modify-footer">
                        <button onClick={e=>{
                            this.props.actionCloseThis(this.state.target);
                            e.stopPropagation();
                        }} className="btn">取消</button>
                    </div>
                </div>
            </div>)
        }else{
            return (<div></div>);
        }

    }
}

const state = (state)=>{
    let active;
    state.modifySearchGroupConfig.activeContent.map((v, k)=> {
        if (v.target === state.common.nowOnContentTarget.id) {
            active = v;
        }
    });

    return ({
        targetObject:active,
        dataHasCreated:active?active.dataHasCreated:undefined
    });
}

const action = (dispatch)=>{
    let actions = {
        actionDidMount:(target)=>{
            return ({
                type:Constants.MODIFY_SEARCH_GROUP_CONFIG_INIT_STATE,
                target:target
            });
        },
        actionCloseThis:(target)=>{
            return ({
                type:Constants.MENU_SETTING_CHANGE_BUTTON_CONFIG_PREVIEW_STATUS,
                target:target,
                nowOnButtonConfig:undefined
            });
        },
        actionSaveDataHasCreated:(target,dataHasCreated)=>{
            console.log(dataHasCreated)
            return ({
                type:Constants.MODIFY_SEARCH_GROUP_CONFIG_SAVE_DATA_HAS_CREATED,
                target:target,
                dataHasCreated:dataHasCreated
            });
        }


    };
    return bindActionCreators(actions,dispatch);
}

export default connect(state,action)(ModifySearchGroupConfig);