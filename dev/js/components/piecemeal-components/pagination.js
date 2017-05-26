/**
 *
 * Created by JasonPeng on 2017/4/26.
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Constants from '../../action/CONSTANTS';
import classnames from 'classnames';
import {getData} from '../../action/normal-table';

class Pager {
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
    constructor(pagination, lastID) {
        this.pagination = pagination;
        this.rows = pagination.rows;
        this.page = pagination.page;
        this.pageIndex = pagination.pageIndex;
        this.records = pagination.records;
        this.total = pagination.total;
        this.LastId = lastID;
    }

    theFirst(){
        this.pageIndex = this.page;
        this.page = 1;
        return this.pagerNewPagination();
    }

    theLast(){
        this.pageIndex = this.page;
        this.page = this.total
        return this.pagerNewPagination();
    }

    last() {
        if (this.page > 1) {
            this.pageIndex = this.page;
            this.page--;
            return this.pagerNewPagination();
        } else {
            return false;
        }
    }

    next() {
        if (this.page < this.total) {
            this.pageIndex = this.page;
            this.page++;
            return this.pagerNewPagination();
        } else {
            return false;
        }
    }

    choicePage(num) {
        this.pageIndex = this.page;
        this.page = num;
        return this.pagerNewPagination();
    }

    resetRows(newRows) {
        if (this.rows > 0) {
            this.pageIndex = this.page;
            this.page = 1;
            this.rows = newRows;
        }
        return this.pagerNewPagination();
    }

    pagerNewPagination() {
        this.pagination.rows = this.rows;
        this.pagination.page = this.page;
        this.pagination.records = this.records;
        this.pagination.total = null;
        this.pagination.LastId = this.LastId;
        return this.pagination;
    }

    getPage() {
        return this.page;
    }
}

/*
*
* 分页工具 引用page类进行数据改变
* */
class Pagination extends React.Component {
    constructor(props) {
        super();
        let lastID = props.data[props.data.length-1]['Id'];
        this.state = {
            api: props.api,
            data: props.data,
            targetID: props.targetID,
            pagination: props.pagination,
        }
        this.Pager = new Pager(props.pagination, lastID);
    }

    componentWillReceiveProps(props) {
        let lastID = props.data[props.data.length - 1]['Id'];
        this.state = {
            api: props.api,
            data: props.data,
            targetID: props.targetID,
            pagination: props.pagination,
        }
        this.Pager = new Pager(props.pagination, lastID);
    }

    createScrollPage() {
        let createPageItem = ()=> {
            let nowOnPage = this.state.pagination.page;
            let total = this.state.pagination.total;
            let arr = [];
            for(let i=1;i<total+1;i++){
                if(i>nowOnPage-3&&i<nowOnPage+3){
                    arr.push(i);
                }
            }

            return arr.map((v, k)=> {
                let className = classnames({
                    "first-child": k === 0 ? true : false,
                    "active": v === nowOnPage ? true : false
                });
                return (<li onClick={e=>{
                    let pagination = this.Pager.choicePage(v);
                    this.props.actionSubmitChangePage(this.state.targetID,this.state.api,pagination)
                    e.stopPropagation();
                }} key={k} className={className}>{v}</li>);
            });

        }
        return <div>
            <ul style={{float:'left'}}>
                <li onClick={e=>{
                let pagination = this.Pager.theFirst();
                pagination?this.props.actionSubmitChangePage(this.state.targetID,this.state.api,pagination):'';
                e.stopPropagation();
            }
            } className="first-child">First
                </li>
                <li onClick={e=>{
                let pagination = this.Pager.last();
                pagination?this.props.actionSubmitChangePage(this.state.targetID,this.state.api,pagination):'';
                e.stopPropagation();
            }
            } >{'<< Previous'}
                </li>
            </ul>
            <ul style={{float:'left'}}>
                {createPageItem()}
            </ul>
            <ul style={{float:'left'}}>
                <li onClick={e=>{
                let pagination = this.Pager.next();
                pagination?this.props.actionSubmitChangePage(this.state.targetID,this.state.api,pagination):'';
                e.stopPropagation();}
            } className="first-child">{'Next >>'}
                </li>
                <li onClick={e=>{
                let pagination = this.Pager.theLast();
                pagination?this.props.actionSubmitChangePage(this.state.targetID,this.state.api,pagination):'';
                e.stopPropagation();}
            } className="first-child">Last
                </li>
            </ul>
        </div>
    }

    createJumpPage() {
        return <div>
            <ul style={{float:'left'}}>
                <li className="normal-content"><input onClick={e=>{
                    e.target.select();
                }} defaultValue={this.state.pagination.page} onBlur={e=>{
                let pagination;
                    let flag = true;
                    if(isNaN(e.target.value)||e.target.value===''||e.target.value<0){
                        flag = false;
                        e.target.value = this.state.pagination.page;
                    }else if(e.target.value>this.state.pagination.total){
                        pagination = this.Pager.choicePage(this.state.pagination.total);
                    }else{
                        pagination = this.Pager.choicePage(e.target.value);
                    }
                    if(flag){
                        this.props.actionSubmitChangePage(this.state.targetID,this.state.api,pagination);
                    }
                  }
                } type="text"/>/<span style={{fontSize:18}}>{this.state.pagination.total}</span>
                </li>
            </ul>
        </div>
    }

    createShowLimit() {
        return <div>
            <ul style={{float:'left'}}>
                <li className="normal-content"><input onClick={e=>{
                    e.target.select();
                }} onBlur={e=>{
                    let pagination;
                    let flag = true;
                    if(isNaN(e.target.value)||e.target.value===''||e.target.value<0){
                        flag = false;
                        e.target.value = this.state.pagination.rows;
                    }else{
                        pagination = this.Pager.resetRows(e.target.value);;
                    }
                    if(flag){
                        this.props.actionSubmitChangePage(this.state.targetID,this.state.api,pagination);
                    }
                  }
                } defaultValue={this.state.pagination.rows} type="text"/>/<span style={{fontSize:18}}>Lines</span>
                </li>
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

let state = state=> {
    return ({});
}

let action = dispatch=> {
    let actions = {
        actionSubmitChangePage: getData,
    }
    return bindActionCreators(actions, dispatch);
}


export default connect(state, action)(Pagination);