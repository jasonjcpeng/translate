/**
 *
 * Created by JasonPeng on 2017/4/26.
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Constants from '../../action/CONSTANTS';
import {getData} from '../../action/normal-table';

class Pager{
    /*
    * "rows": 10,
     "page": 1,
     "sidx": "Id",
     "sord": "ASC",
     "records": 0,
     "total": 0,
     "LastId": "0",
     "dic": [],
     "dateList": []*/
    constructor(pagination){
        this.pagination = pagination;
        this.rows = pagination.rows;
        this.page = pagination.page;
        this.records = pagination.records;
        this.total = pagination.total;
        this.LastId = pagination.LastId;
    }

    next(){
        if(this.page<=this.total){
            this.page++;
        }

        return this.pagerNewPagination();
    }

    resetRows(newRows){
        if(this.rows>0){
            this.row = newRows;
        }
        return this.pagerNewPagination();
    }

    pagerNewPagination(){
        this.pagination.rows = this.rows;
        this.pagination.page = this.page;
        this.pagination.records = this.records;
        this.pagination.total = this.total;
        this.pagination.LastId = this.LastId;
        return  this.pagination;
    }

    say(){
        console.log(this.rows);
    }
}

class Pagination extends React.Component {
    constructor(props) {
        super();
        let lastID = props.data.length;
        this.state = {
            api:props.api,
            data:props.data,
            targetID:props.targetID,
            pagination:props.pagination,
        }
        this.Pager = new Pager(props.pagination,lastID);
    }

    componentWillUpdate(){
        let lastID = this.state.data.length;
        this.Pager = new Pager(this.state.pagination,lastID);
    }

    createScrollPage(){
        return <div><ul style={{float:'left'}}>
            <li className="first-child">上一页</li>
        </ul>
            <ul style={{float:'left'}}>
                <li  className="first-child">1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>5</li>
            </ul>
            <ul style={{float:'left'}}>
                <li className="first-child">下一页</li>
            </ul></div>
    }

    createJumpPage(){
        return <div>
            <ul style={{float:'left'}}>
                <li className="normal-content">跳转至第<input  type="number"/>页 共<span style={{fontSize:18}}>20</span>页</li>
                <li className="first-child">跳转</li>
            </ul>
        </div>
    }

    createShowLimit(){
        return <div>
            <ul style={{float:'left'}}>
                <li className="normal-content">每页显示<input  onBlur={e=>{
                    let pagination = this.Pager.resetRows(e.target.value);
                    this.props.actionSubmitChangePage(this.state.targetID,this.state.api,pagination);
                    console.log(e.target.value)}
                } defaultValue={this.state.pagination.rows} type="number"/>条</li>
            </ul>
        </div>
    }

    render() {
        return (
            <div className="component-option-bar">
                {this.createScrollPage()}
                {this.createJumpPage()}
                {this.createShowLimit()}
            </div>);
    }
}

let state= state=>{
    return ({});
}

let action = dispatch=>{
    let actions = {
        actionSubmitChangePage:getData,
    }
    return bindActionCreators(actions,dispatch);
}


export default connect(state,action)(Pagination);