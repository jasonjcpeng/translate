import React from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import * as Constants from '../../action/CONSTANTS';
import {bindActionCreators} from 'redux';
import {apiSetRoleAuthorize} from '../../services/api';
/*
 * @param
 * onCancel:() 必填 关闭遮罩的回调，如没有则不显示取消按钮
 * */
class ShieldAlert extends React.Component {
    constructor(props) {
        super();
        this.state = {
            selectedRole: props.selectedItem,
        }
    }

    createMenuSettingTableBody(toggleCode) {
        //创造批量选择框
        let createBatchSelectBody = (v)=> {
            let value = (()=> {
                let result = false;
                this.props.batchOnItem.map(val=> {
                    if (v.id === val.id) {
                        return result = true;
                    }
                });
                return result
            })();
            let className = classnames({
                "checkbox": true,
                'checkbox-checked': value
            });
            return (<td>
                <div onClick={e=>{
                        this.props.actionBatchSelectItem(this.props.targetID,v);
                        e.stopPropagation();
                    }} className={className}></div>
            </td> );
        }

        let quickSort = (arr, root = {code: '0'}, result = [])=> {
            let menu = [];
            if (arr.length > 0) {
                let newArr = arr.filter(v=> {
                    if (v.parentCode === root.code) {
                        menu.push(v);
                    } else {
                        return v;
                    }
                });
                if (menu.length > 0) {
                    for (let i in menu) {
                        result.push(menu[i]);
                        quickSort(newArr, menu[i], result);
                    }
                }
            }
            return result;
        }
        let menu = quickSort(this.props.currentMenu);
        let trIsHidden = (v)=> {
            let toggleStateFlag = true;
            if (v.parentCode === '0') {
                toggleStateFlag = false;
            } else {
                for (let i in toggleCode) {
                    if (v.parentCode === toggleCode[i]) {
                        toggleStateFlag = false;
                    }
                }
            }
            return toggleStateFlag;
        }
        let arrowIconMargin = (v, margin)=> {
            let localMargin = margin;
            for (let i = 0; i < this.props.currentMenu.length; i++) {
                if (v.parentCode === this.props.currentMenu[i].code) {
                    localMargin += arrowIconMargin(this.props.currentMenu[i], (margin + 5));
                }
            }
            return localMargin
        }
        let isMenuHasChild = (newMenu, currentMenu)=> {
            for (let i in newMenu) {
                if (newMenu[i].parentCode === currentMenu.code) {
                    return true;
                    break;
                }
            }
            return false;
        }
        let trToggleIconClassNames = (v)=> {
            let toggleStateFlag = false;
            for (let i in toggleCode) {
                if (v.code === toggleCode[i]) {
                    toggleStateFlag = true;
                }
            }
            return toggleStateFlag ? 'menu-toggle fa fa-caret-down' : 'menu-toggle fa fa-caret-right';
        }
        return menu.map((v, k)=> {
            return (<tr hidden={trIsHidden(v)} key={k}>
                {createBatchSelectBody(v)}
                <td>{ (()=> {
                    return (<div style={{width: '40px', float: 'left', paddingLeft: arrowIconMargin(v, 15) + 'px'}}>
                        {(()=> {
                            if (isMenuHasChild(menu, v)) {
                                return (<i onClick={(e)=> {
                                    this.props.actionToggleItem(this.props.targetID,v.code);
                                    e.stopPropagation();
                                }} className={trToggleIconClassNames(v)}></i>)
                            } else {
                                return (<i className="menu-no-toggle"></i>)
                            }
                        })()}
                        <span style={{marginLeft: '5px'}}>{k + 1}</span>
                    </div>);
                })()}</td>
                <td style={{paddingLeft: arrowIconMargin(v, 40) + 'px'}}>{v.menuName}</td>
                <td ><i className={'fa ' + v.icon}></i></td>
                <td></td>
            </tr>);
        });

    }

    render() {
        //创造批量选择头
        let createBatchSelect = ()=> {
            let value = (()=> {
                return (this.props.currentMenu.length > 0) && (this.props.currentMenu.length === this.props.batchOnItem.length) ? true : false;
                return false
            })();

            let className = classnames({
                "checkbox": true,
                'checkbox-checked': value
            });
            return (<th style={{width:30}}>
                <div onClick={e=>{
                    this.props.actionBatchSelectItem(this.props.targetID,this.props.currentMenu);
                    e.stopPropagation();
                }} className={className}></div>
            </th> );
        }
        return (<div className="shield">
            <div style={{height:'90%',width:'90%',top:'5%',left:'5%'}} className="shield-content">
                <div className="shield-content-table">
                    <table >
                        <thead>
                        <tr>
                            {createBatchSelect()}
                            <th style={{width: '60px'}}></th>
                            <th style={{width: '300px'}}>名称</th>
                            <th style={{width: '60px'}}>图标</th>
                            <th>介绍</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.createMenuSettingTableBody(this.props.currentToggleItem)}
                        </tbody>
                    </table>
                </div>
                <div className="shield-content-footer">
                    <button onClick={e=>{
                    this.props.actionCloseThis(this.props.targetID);
                    e.stopPropagation();
                    }} className="btn">取消
                    </button>
                    <button onClick={
                        e=>{
                         this.props.actionSubmitRoleAuthorize(this.props.targetID,this.props.target.status.nowOnClickButton.api,this.state.selectedRole,this.props.batchOnItem);
                            e.stopPropagation();
                        }
                    } className="btn btn-finish">确认
                    </button>
                </div>
            </div>

        </div>)
    }
}

ShieldAlert.defaultProps = {}

let state = (state)=> {
    let target, currentToggleItem, batchOnItem;
    state.containerTitleMenu.activeContent.map(v=> {
        if (state.common.nowOnContentTarget && v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
        }
    });
    return ({
        target: target ? target : undefined,
        targetID: target ? target.obj.id : '',
        currentMenu: state.sideBar.menu,
        currentToggleItem: target ? target.status.roleAuthorize.currentToggleItem : [],
        batchOnItem: target ? target.status.roleAuthorize.batchOnItem : []
    });
}

let action = (dispatch)=> {
    let actions = {
        actionToggleItem: (targetID, code)=> {
            return ({
                type: Constants.SHIELD_BUTTON_GROUP_ROLE_AUTHORIZE_TOGGLE_STATUS,
                targetID: targetID,
                code: code
            });
        },
        actionBatchSelectItem: (targetID, data)=> {
            if (Object.prototype.toString.apply(data) === '[object Object]') {
                data = [data];
            }
            return ({
                type: Constants.SHIELD_BUTTON_GROUP_ROLE_AUTHORIZE_BATCH_SELECT_ITEM,
                targetID: targetID,
                onBatchItem: data
            });
        },
        actionCloseThis:(targetID)=>{
            return {
                type:Constants.BUTTON_GROUP_ROLE_AUTHORIZE_CLOSE,
                targetID:targetID
            }
        },
        actionSubmitRoleAuthorize: (targetID,api, roles, modules)=> {
            return dispatch=>{
                apiSetRoleAuthorize(api,roles,modules).then(
                    res=>{
                        return dispatch(actions.actionCloseThis(targetID))
                    }
                ).catch(rej=>{
                    console.log(rej)
                })
            }

        }
    }
    return bindActionCreators(actions, dispatch);
}


export default connect(state, action)(ShieldAlert);