import React from 'react';
import {connect} from 'react-redux';
import Selector from './piecemeal-search-group/piecemeal-search-group-selector';
import Inputer from './piecemeal-search-group/piecemeal-search-group-inputer';
import Dater from './piecemeal-search-group/piecemeal-search-group-dater';
import {getData,actionToggleSearchGroup} from '../../action/normal-table';

/*
* targetID:页面ID
 tableConfigArgs:本页面请求参数
 api:本页面API,
* */
class SearchGroupDefault extends React.Component {
    constructor(props) {
        super();
        this.state = {
            dispatch: props.dispatch,
            targetID:props.targetID,
            tableConfigArgs:props.tableConfigArgs,
            api:props.api,
            selector_1_value: '',
            input_1_value:'',
            date_1_value:''
        }
    }
    //根据当前搜索参数请求新的页面
    reLoadTableWithSearchArgs(args){
        this.props.dispatch(getData(this.state.targetID,this.state.api,args));
    }
    //收起搜索栏
    toggleOverSearchGroup(){
        this.props.dispatch(actionToggleSearchGroup(this.props.targetID,false));
    }

    createDater_1(){
        let config = {
            title: '时间1',
            onChange:(e)=> {
                this.setState({
                    date_1_value:e
                });
            }
        }
        return <Dater config={config}></Dater>
    }

    createSelector_1() {
        let config = {
            options: [{key: '1', name: '选项一'}, {key: '2', name: '选项二'}, {key: '3', name: '选项三'}, {
                key: '4',
                name: '选项四'
            }, {key: '5', name: '选项五'}, {key: '6', name: '选项六'}],
            selected:' ',
            title: '下拉选择',
            defaultOptionName: '下拉选择',
            onChange:(e)=>{
                this.setState({
                    selector_1_value:e
                });
            }
        }
        return <Selector config={config}></Selector>;
    }

    createInputer_1() {
        let config = {
            title: '输入框',
            placeholder: '输入框',
            onChange:(e)=> {
                    this.setState({
                        input_1_value:e
                    });
            }
        }
        return <Inputer  config={config}></Inputer>
    }

    createSearchBtn() {
        return (<li onClick={e=>{
            console.log(this.state.date_1_value);
            console.log(this.state.input_1_value);
            console.log(this.state.selector_1_value);
            //此处对this.state.tableConfigArgs传入重置后的搜索参数
                this.reLoadTableWithSearchArgs(this.state.tableConfigArgs);
                this.toggleOverSearchGroup();
            e.stopPropagation();
        }} className="search-btn">
            查询
        </li >);
    }

    render() {
        return <div className="search-group animation-flipTop animation-fadeIn">
            <ul>
                {this.createSelector_1()}
                {this.createInputer_1()}
                {this.createDater_1()}
                {this.createSearchBtn()}
            </ul>
        </div>
    }

}

export default connect()(SearchGroupDefault);
