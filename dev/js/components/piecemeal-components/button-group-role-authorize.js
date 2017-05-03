import React from 'react';
import ModifyShield from './modifyShield';
import {connect} from 'react-redux';
import * as Constants from '../../action/CONSTANTS';
import {bindActionCreators} from 'redux';
/*
 * @param
 * */
let TargetID;

class ShieldAlert extends React.Component {
    constructor(props) {
        super();
    }


    createMenuSettingTableBody(toggleCode) {
        let quickSort = (arr, root = {code: '0'}, result=[])=>{
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
                <td>{ (()=> {
                    return (<div style={{width: '40px', float: 'left', paddingLeft: arrowIconMargin(v, 15) + 'px'}}>
                        {(()=> {
                            if (isMenuHasChild(menu, v)) {
                                return (<i onClick={(e)=> {
                                    this.props.toggleSingleMenuItem(v.code);
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
        return (<div className="shield">
            <div className="shield-content">
                <table className="">
                    <thead>
                    <tr>
                        <th style={{width: '60px'}}></th>
                        <th style={{width: '300px'}}>名称</th>
                        <th style={{width: '60px'}}>图标</th>
                        <th>介绍</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.createMenuSettingTableBody(this.props.target.status.defaultMenuSettingTableToggleItem)}
                    </tbody>
                </table>

            </div>
        </div>)
    }
}

ShieldAlert.defaultProps = {}

let state = (state)=> {
    let target;
    state.containerTitleMenu.activeContent.map(v=> {
        if (state.common.nowOnContentTarget && v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
        }
    });
    return ({
        target: target ? target : undefined,
        currentMenu:state.sideBar.menu
    });
}

let action = (dispatch)=> {
    let actions = {}
    return bindActionCreators(actions, dispatch);
}


export default connect(state, action)(ShieldAlert);