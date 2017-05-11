import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/menu-setting-option-menu';
//Component
import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
import classNames from 'classnames';
import ShieldAlert from '../piecemeal-components/shield-alert';
import Checker from '../piecemeal-components/checker';
import ModifyShield from '../piecemeal-components/modifyShield';
import ModifySearchGroupConfig from '../piecemeal-components/modify-search-group-config';
//json
import IconList from '../../../jsons/icon-list.json';
import BtnGroupList from '../../../jsons/btn-group-list.json';
import ComponentType from '../../../jsons/modify-shield-component-type.json';
//tool
import {getNowFormatDate, IsObjEmpty} from '../../config/tools';
import {isOnline} from '../../config/config'


class MenuSettingOptionAddMenu extends React.Component {
    componentWillMount() {
        if (!this.props.target.status) {
            this.props.GetMount(this.props.target.obj);
        }
    }

    componentWillUpdate(){
        let deleteActiveContent = (k, v)=> {
            this.props.closeMenuSetting(k, v);
            let result = null;
            if (k > 0 && k + 1 === this.props.activeContent.length) {
                result = this.props.activeContent[k - 1];
            } else if (this.props.activeContent.length > 0) {
                result = this.props.activeContent[k + 1];
            }
            result ? this.props.selectActiveContent(result) : '';
        }
        if(this.props.isFinish){
            this.props.AppDidMount();
            deleteActiveContent();

        }
    }

    //判断需要渲染哪个进度状态视图界面
    judgeRenderFunction() {
        let progressState = this.props.target.status.progress;
        let nowOnProgress = function () {
            for (let i in progressState) {
                if (progressState[i].on) {
                    return i;
                }
            }
        }();
        switch (nowOnProgress) {
            case '0':
                return this.createOperationSetUp();
                break;
            case '1':
                return this.createViewPointSetting();
                break;
            case '2':
                return this.createButtonGroupSetting();
                break;
            case '3':
                return this.createModifyViewPointSetting();
                break;
        }

    }

    //渲染添加修改遮罩层设置
    createModifyViewPointSetting() {
        let handleOnChange = (key, val, itemKey, itemVal)=> {
            let singleItem = {
                name: val.name,
                isEnable: val.isEnable,
                CNName: val.CNName,
                isMultiColumns: val.isMultiColumns,
                isDisable:val.isDisable,
                isMustFilling:val.isMustFilling,
                componentType: val.componentType,
                width: val.width,
                componentWidth: val.componentWidth,
                api: val.api
            };
            singleItem[itemKey] = itemVal;
            let newValue = [];
            newValue = this.props.menuData.modifyViewPoint.map((v, k)=> {
                if (k === key) {
                    return singleItem;
                } else {
                    return v;
                }
            });
            this.props.changeMenuData(this.props.targetMenuSort, 'modifyViewPoint', newValue);
        }

        let handleDelete = (key)=> {
            let newValue = [];
            newValue = this.props.menuData.modifyViewPoint.filter((v, k)=> {
                if (!(k === key)) {
                    return v;
                }
            });
            this.props.changeMenuData(this.props.targetMenuSort, 'modifyViewPoint', newValue);

        }

        let createMultiColumnsOnChecker = (k, v)=> {
            return (<input onChange={
                    e=>{
                        let width = (()=>{
                            if(!e.target.value||e.target.value<0){
                                return 0;
                            }else if(e.target.value>100){
                                return 100;
                            }else{
                                return e.target.value
                            }
                        })();
                        handleOnChange(k,v,'width',width);
                    }
                } value={v.width} min="0" max="100" type="number"/>)
        }
        let createItemComponentWidthOnChecker = (k, v)=> {
            return (<input onChange={
                e=>{
                    let componentWidth = (()=>{
                        if(!e.target.value||e.target.value<0){
                            return 0;
                        }else if(e.target.value>100){
                            return 100;
                        }else{
                            return e.target.value
                        }
                    })();
                    handleOnChange(k,v,'componentWidth',componentWidth);
                }
            } value={v.componentWidth} min="0" max="100" type="number"/>)
        }

        let createComponentTypeSelector = (k, v)=> {
            let mapOption = ComponentType.componentType.map((v, k)=> {
                return (<option key={k} value={v.type}>{v.remark}</option>);
            })
            return (<select onChange={(e)=>{
                handleOnChange(k,v,'componentType',e.target.value);
            }} selected={v.componentType}>
                {mapOption}
            </select>);
        }

        let tBody = ()=> {
            return this.props.menuData.modifyViewPoint.map((v, k)=> {
                return <tr key={k}>
                    <td><Checker key={v.isEnable} checkState={v.isEnable} funcOnClick={(callBackCheck)=>{
                        handleOnChange(k,v,'isEnable',callBackCheck);
                    }}></Checker></td>
                    <td>
                        <div className="sort">
                            <div onClick={()=>{
                        let newValue = this.props.menuData.modifyViewPoint;
                        for(let i=0;i<newValue.length;i++){
                            if(k>0&&k===i){
                                let temp = newValue[i-1];
                                newValue[i-1] =  newValue[i];
                                newValue[i] = temp;
                            }
                        }

                        this.props.changeMenuData(this.props.targetMenuSort, 'modifyViewPoint', newValue);
                    }
                    } className="up"></div>
                            <div onClick={()=>{
                        let newValue = this.props.menuData.modifyViewPoint;
                        for(let i=0;i<newValue.length;i++){
                            if(k<newValue.length-1&&k===i){
                                let temp = newValue[i+1];
                                newValue[i+1] =  newValue[i];
                                newValue[i] = temp;
                            }
                        }

                        this.props.changeMenuData(this.props.targetMenuSort, 'modifyViewPoint', newValue);}}
                                 className="down"></div>
                        </div>
                    </td>
                    <td>{v.name}</td>
                    <td><input onChange={
                        e=>{
                            handleOnChange(k,v,'CNName',e.target.value);
                        }
                    } value={v.CNName} type="text"/></td>
                    <td><Checker key={v.isDisable} checkState={v.isDisable} funcOnClick={(callBackCheck)=>{
                        handleOnChange(k,v,'isDisable',callBackCheck);
                    }}></Checker></td>
                    <td><Checker key={v.isMustFilling} checkState={v.isMustFilling} funcOnClick={(callBackCheck)=>{
                        handleOnChange(k,v,'isMustFilling',callBackCheck);
                    }}></Checker></td>
                    <td>{createComponentTypeSelector(k, v)}</td>
                    <td><input onChange={
                        e=>{
                            handleOnChange(k,v,'api',e.target.value);
                        }
                    } value={v.api} type="text"/></td>
                    <td><Checker key={v.isMultiColumns} checkState={v.isMultiColumns} funcOnClick={(callBackCheck)=>{
                        handleOnChange(k,v,'isMultiColumns',callBackCheck);
                    }}></Checker></td>
                    <td>{createMultiColumnsOnChecker(k, v)}</td>
                    <td>{createItemComponentWidthOnChecker(k, v)}</td>
                    {<td><i onClick={()=>{
                     handleDelete(k);
                     }} className="fa fa-times-circle delete"></i></td>}
                </tr>
            });
        }
        let createFieldList = ()=> {
            let handleOnClick = (viewPointItem)=> {
                let viewPointGroup = this.props.menuData.modifyViewPoint;
                viewPointGroup.push(viewPointItem);
                this.props.changeMenuData(this.props.targetMenuSort, 'modifyViewPoint', viewPointGroup);
            }

            return '';
            /*return this.props.viewPointConfigData.map((v, k)=> {
                let flag = true;
                for (let i in this.props.menuData.modifyViewPoint) {
                    if (this.props.menuData.modifyViewPoint[i].name === v.name) {
                        flag = false;
                    }
                }
                if(v.name==='AX_Id'||v.name==='AX_ParentId'){
                    flag = false;
                }
                if (flag) {
                    return (<li onClick={()=>{
                        let singleItem = {
                            name:v.name,
                            isEnable: v.isEnable,
                            CNName: v.CNName,
                            isMultiColumns:false,
                            isDisable:false,
                            isMustFilling:false,
                            componentType:'input',
                            width: 100,
                            componentWidth:50,
                            api:''
                        };
                        handleOnClick(singleItem);
                    }
                    } key={k}>{v.name}</li>);
                }
            });*/
        }

        let table = ()=> {
            return (<table key="ModifyViewPointSetting" className="setting-table">
                <thead>
                <tr>
                    <th>是否呈现</th>
                    <th style={{width:"50px"}}>排序</th>
                    <th>Api字段名</th>
                    <th>匹配中文名</th>
                    <th style={{width:"50px"}}>只可见</th>
                    <th style={{width:"50px"}}>必填</th>
                    <th>组件类型</th>
                    <th>组件API</th>
                    <th style={{width:"90px"}}>并排显示</th>
                    <th style={{width:"120px"}}>总体宽度设置(%)</th>
                    <th style={{width:"120px"}}>组件宽度设置(%)</th>
                    <th style={{width:"50px"}}>删除</th>
                </tr>
                </thead>
                <tbody>
                {tBody()}
                </tbody>
            </table>)
        };

        return (<div>
            <div className="field-list">
                <ul>{createFieldList()}</ul>
            </div>
            {table()}
            <div className="setting-remark">
                注:并排显示需要额外设置宽度，并排列的宽度之和不得超过100%。
            </div>
        </div>);

    }

    //渲染按钮组设置
    createButtonGroupSetting(){
        let createBtnGroupList = ()=> {
            let btnGroupList = BtnGroupList;
            let render = [];
            let btnGroup = this.props.menuData.btnGroup;
            let handleOnClick = (componentName, btnGroupItem)=> {
                let btnItem = {
                    componentName: componentName,
                    componentRemark: btnGroupItem.remark,
                    isNeedTarget: btnGroupItem.isNeedTarget,
                    isToggleGroup: btnGroupItem.isNeedTarget,
                    CNName: '',
                    api: '',
                    btnConfig: []
                }
                btnGroup.unshift(btnItem);
                this.props.changeMenuData(this.props.targetMenuSort, 'btnGroup', btnGroup);
            }
            for (let componentName in btnGroupList) {
                let item = (<li key={componentName} onClick={()=>{
                    handleOnClick(componentName,btnGroupList[componentName]);
                }}>{btnGroupList[componentName].remark}</li>);
                render.push(item);
            }
            return (<div className="btn-group-setting-btn-group-list">
                <ul >{render}</ul>
            </div>);
        }

        let createBtnGroupTableBody = ()=> {
            let handleOnChange = (key, val, itemKey, itemVal)=> {
                let singleItem = {
                    componentName: val.componentName,
                    componentRemark: val.componentRemark,
                    isNeedTarget: val.isNeedTarget,
                    isToggleGroup: val.isToggleGroup,
                    CNName: val.CNName,
                    api: val.api,
                    btnConfig: val.btnConfig
                };
                singleItem[itemKey] = itemVal;
                let newValue = [];
                newValue = this.props.menuData.btnGroup.map((v, k)=> {
                    if (k === key) {
                        return singleItem;
                    } else {
                        return v;
                    }
                });
                this.props.changeMenuData(this.props.targetMenuSort, 'btnGroup', newValue);
            }

            let handleDelete = (key)=> {
                let newValue = [];
                newValue = this.props.menuData.btnGroup.filter((v, k)=> {
                    if (!(k === key)) {
                        return v;
                    }
                });
                this.props.changeMenuData(this.props.targetMenuSort, 'btnGroup', newValue);

            }

            return this.props.menuData.btnGroup.map((val, k)=> {
                return (<tr key={k}>
                    <td>{val.componentName}</td>
                    <td>
                        <div className="sort">
                            <div onClick={()=>{
                        let newValue = this.props.menuData.btnGroup;
                        for(let i=0;i<newValue.length;i++){
                            if(k>0&&k===i){
                                let temp = newValue[i-1];
                                newValue[i-1] =  newValue[i];
                                newValue[i] = temp;
                            }
                        }

                        this.props.changeMenuData(this.props.targetMenuSort, 'btnGroup', newValue);
                    }
                    } className="up"></div>
                            <div onClick={()=>{
                        let newValue = this.props.menuData.btnGroup;
                        for(let i=0;i<newValue.length;i++){
                            if(k<newValue.length-1&&k===i){
                                let temp = newValue[i+1];
                                newValue[i+1] =  newValue[i];
                                newValue[i] = temp;
                            }
                        }

                        this.props.changeMenuData(this.props.targetMenuSort, 'btnGroup', newValue);}}
                                 className="down"></div>
                        </div>
                    </td>
                    <td>{val.componentRemark}</td>
                    <td><input key={'CNName'+val.componentName+''+k} type="text" onChange={e=>{
                        handleOnChange(k,val,'CNName',e.target.value);
                    }} value={val.CNName}/></td>
                    {(()=> {
                        if (val.isNeedTarget > -1) {
                            return <td><input key={'api' + val.componentName + '' + k} type="text" onChange={e=> {
                                handleOnChange(k, val, 'api', e.target.value);
                            }} value={val.api}/></td>
                        } else {
                            if(val.componentName==='timeSearch'){
                                return <td>
                                    <input key={'api' + val.componentName + '' + k} type="text" onChange={e=> {
                                handleOnChange(k, val, 'api', e.target.value);
                            }} value={val.api}/>
                                </td>
                            }else{
                                return <td>
                                    <button onClick={e=> {
                                    let args = {
                                        key:k,
                                        value:val,
                                        btnGroup:this.props.menuData.btnGroup
                                    }

                                    this.props.actionChangeButtonConfigPreviewStatus(this.props.targetMenuSort,args);
                                    e.stopPropagation();
                                }
                                }>详细配置
                                    </button>
                                </td>
                            }
                        }
                    })()}
                    <td><Checker style={(()=>{
                        if(val.isNeedTarget!==0){
                            return {cursor:"text"}
                        }
                    })()} key={val.isToggleGroup} checkState={val.isToggleGroup>-1?val.isToggleGroup:false} funcOnClick={(checkState)=>{
                        if(!val.isNeedTarget){
                            handleOnChange(k,val,'isToggleGroup',checkState);
                        }
                    }}></Checker></td>
                    <td><i onClick={()=>{
                        handleDelete(k)
                    }} className="fa fa-times-circle delete"></i></td>
                </tr> );
            });

        }

        let table = ()=> {
            return <table key="ButtonGroupSetting" className="setting-table">
                <thead>
                <tr>
                    <th>组件名称</th>
                    <th style={{width:"50px"}}>排序</th>
                    <th>组件备注</th>
                    <th>匹配中文名</th>
                    <th>匹配参数</th>
                    <th style={{maxWidth:"120px"}}>内层选中按钮组</th>
                    <th style={{width:"50px"}}>删除</th>
                </tr>
                </thead>
                <tbody>
                {createBtnGroupTableBody()}
                </tbody>
            </table>
        }

        return <div className="btn-group-setting">{createBtnGroupList()}
            {table()}
            <div className="setting-remark">
                注:选择上方功能条将其加入按钮组，需要有选中目标的按钮只能作为内层按钮。
            </div>
        </div>;
    }

    //渲染表格视图设置
    createViewPointSetting() {
        let handleOnChange = (key, val, itemKey, itemVal)=> {
            let singleItem = val.api===undefined?{
                name: val.name,
                isEnable: val.isEnable,
                CNName: val.CNName,
                width: val.width,
            }:{
                name: val.name,
                isEnable: val.isEnable,
                CNName: val.CNName,
                width: val.width,
                bindField:val.bindField,
                api:val.api
            };
            singleItem[itemKey] = itemVal;
            let newValue = [];
            newValue = this.props.menuData.viewPoint.map((v, k)=> {
                if (k === key) {
                    return singleItem;
                } else {
                    return v;
                }
            });
            this.props.changeMenuData(this.props.targetMenuSort, 'viewPoint', newValue);
        }

        let handleDelete = (key)=> {
            let newValue = [];
            newValue = this.props.menuData.viewPoint.filter((v, k)=> {
                if (!(k === key)) {
                    return v;
                }
            });
            this.props.changeMenuData(this.props.targetMenuSort, 'viewPoint', newValue);

        }

        let tBody = ()=> {
            return this.props.menuData.viewPoint.map((v, k)=> {
                    return <tr key={k}>
                        <td><Checker key={v.isEnable} checkState={v.isEnable} funcOnClick={(callBackCheck)=>{
                             handleOnChange(k,v,'isEnable',callBackCheck);
                        }}></Checker></td>
                        <td>
                            <div className="sort">
                                <div onClick={()=>{
                        let newValue = this.props.menuData.viewPoint;
                        for(let i=0;i<newValue.length;i++){
                            if(k>0&&k===i){
                                let temp = newValue[i-1];
                                newValue[i-1] =  newValue[i];
                                newValue[i] = temp;
                            }
                        }

                        this.props.changeMenuData(this.props.targetMenuSort, 'viewPoint', newValue);
                       }
                    } className="up"></div>
                                <div onClick={()=>{
                        let newValue = this.props.menuData.viewPoint;
                        for(let i=0;i<newValue.length;i++){
                            if(k<newValue.length-1&&k===i){
                                let temp = newValue[i+1];
                                newValue[i+1] =  newValue[i];
                                newValue[i] = temp;
                            }
                        }

                        this.props.changeMenuData(this.props.targetMenuSort, 'viewPoint', newValue);}}
                                     className="down"></div>
                            </div>
                        </td>
                        <td>{v.name}</td>
                        <td><input key={'CNName'+v.name+''+k} onChange={
                    e=>{
                        handleOnChange(k,v,'CNName',e.target.value);
                    }
                    } value={v.CNName} type="text"/></td>
                        <td><input  key={'api'+v.name+k} disabled={v.api===undefined?true:false} onChange={
                            e=>{
                                handleOnChange(k,v,'api',e.target.value);
                            }
                        } value={v.api} type="text"/></td>
                        <td><input  key={'bindField'+v.name+k} disabled={v.bindField===undefined?true:false} onChange={
                            e=>{
                                handleOnChange(k,v,'bindField',e.target.value);
                            }
                        } value={v.bindField} type="text"/></td>
                        <td><input key={'delete'+v.name+''+k} onChange={
                    e=>{
                    let width = (()=>{
                       if(!e.target.value||e.target.value<0){
                       return 0;
                       }else if(e.target.value>100){
                       return 100;
                       }else{
                       return e.target.value
                       }
                    })();
                            handleOnChange(k,v,'width',width);
                        }
                    } value={v.width} min="0" max="100" type="number"/></td>
                        {/*<td><i onClick={()=>{
                         handleDelete(k);
                         }} className="fa fa-times-circle delete"></i></td>*/}
                    </tr>
            });
        }
        let createFieldList = ()=> {

            let handleOnClick = (viewPointItem)=> {
                let viewPointGroup = this.props.menuData.viewPoint;
                viewPointGroup.unshift(viewPointItem);
                this.props.changeMenuData(this.props.targetMenuSort, 'viewPoint', viewPointGroup);
            }
            let createOptionsField = ()=>{
                if(this.props.viewPointConfigData[0]){
                    let v = {
                        name: '开关式操作器',
                        isEnable:true,
                        CNName:'',
                        width: 0,
                        bindField:'',
                        api:''
                    };
                    return [<li className="spacial" key={'options'} onClick={()=>{
                        v.name='';
                        handleOnClick(v);
                    }}>{v.name}</li>]
                }else{
                    return [];
                }
            }
            return createOptionsField();
                /*.concat(this.props.viewPointConfigData.map((v, k)=> {
                for (let i in this.props.menuData.viewPoint) {
                    if (this.props.menuData.viewPoint[i].name === v.name) {
                        flag = false;
                    }
                }
                    return (<li onClick={()=> {
                        handleOnClick(v);
                    }
                    } key={k}>{v.name}</li>);
            }));*/


        }

        let table = ()=> {
            return (<table key="ViewPointSetting" className="setting-table">
                <thead>
                <tr>
                    <th>是否呈现</th>
                    <th style={{width:"50px"}}>排序</th>
                    <th>Api字段名</th>
                    <th>匹配中文名</th>
                    <th>匹配Api</th>
                    <th>绑定布尔字段</th>
                    <th style={{width:"90px"}}>宽度设置(%)</th>
                    {/*<th style={{width:"50px"}}>删除</th>*/}
                </tr>
                </thead>
                <tbody>
                {tBody()}
                </tbody>
            </table>)
        };

        return (<div>
            <div className="field-list">
                <ul>{createFieldList()}</ul>
            </div>
            {table()}</div>);

    }

    //渲染功能设置
    createOperationSetUp() {
        let createIsRootMenuCheckBox = ()=> {
            return (
                <li><span>作为节点菜单:</span>
                    <Checker key={this.props.isRootMenu} checkState={this.props.isRootMenu} funcOnClick={(callBackCheckState)=>{
                        this.props.checkIsRootMenu(this.props.targetMenuSort,callBackCheckState);
                    }}></Checker>
                </li> );
        }


        let iconClassName = (()=> {
            if (this.props.menuData.icon !== '') {
                return 'fa ' + this.props.menuData.icon;
            } else {
                return '';
            }
        })();
        let iContent = (()=> {
            if (this.props.menuData.icon === '') {
                return '空';
            } else {
                return '';
            }
        })();
        return (
            <div className="standard-ul standard-ul-two-column">
                <ul>
                    <li><span>上级菜单:</span><span><input type="text" disabled={true}
                                                       value={(()=>{
                                                           if(this.props.targetMenuSort==='menuSettingAddMenu'){
                                                               return this.props.target.obj.targetMenu === '0'?"根级菜单":this.props.target.obj.targetMenu.menuName;
                                                           }else{
                                                               return this.props.target.obj.targetMenu.parentCode ==='0'?"根级菜单":this.props.target.obj.targetMenu.parentCode;
                                                           }
                                                       })()}/></span>
                    </li>
                    {createIsRootMenuCheckBox()}
                    <li><span>上级菜单Code:</span><span><input type="text" disabled={true}
                                                           value={(()=>{
                                                               if(this.props.targetMenuSort==='menuSettingAddMenu'){
                                                                   return this.props.target.obj.targetMenu === '0'?"0":this.props.target.obj.targetMenu.code
                                                               }else{
                                                                   return this.props.target.obj.targetMenu.parentCode ==='0'?"0":this.props.target.obj.targetMenu.parentCode
                                                               }
                                                           })()}
                                                        /></span>
                    </li>
                    <li><span>菜单名称:</span><span><input value={this.props.menuData.menuName!==''?this.props.menuData.menuName:''} onChange={
                        e=>{
                            this.props.changeMenuData(this.props.targetMenuSort,'menuName',e.target.value);
                        }
                    } type="text"/></span></li>
                    {(()=> {
                        if (!this.props.isRootMenu) {
                            return (<div>
                                <li><span>菜单视图项vAPI:</span><span><input
                                    value={this.props.menuData.viewPointConfigApi} onChange={
                                    e=>{
                                        this.props.changeMenuData(this.props.targetMenuSort,'viewPointConfigApi',e.target.value);
                                    }
                                } type="text"/></span></li>
                                <li><span>菜单内容项API:</span><span><input value={this.props.menuData.api} onChange={
                                    e=>{
                                        this.props.changeMenuData(this.props.targetMenuSort,'api',e.target.value);
                                    }
                                } type="text"/></span></li>
                               {/* <li><span>视图类型:</span><span><select value={this.props.menuData.menuSort} onChange={e=>{
                                    this.props.changeMenuData(this.props.targetMenuSort,'menuSort',e.target.value);
                                }}>
                                {(()=> {
                                    let allSort = [0, 1, 2, 3];

                                    function writeContent(sort) {
                                        switch (sort) {
                                            case 0:
                                                return '普通表格';
                                                break;
                                            case 1:
                                                return '一般表格';
                                                break;
                                            case 2:
                                                return '高级表格';
                                                break;
                                            case 3:
                                                return '超级表格';
                                                break;
                                        }
                                    }

                                    return allSort.map((v, k)=> {
                                        return (<option key={k} value={v}>{writeContent(v)}</option>);
                                    });
                                }).apply(this)}
                            </select></span></li>*/}
                            </div>);
                        }
                    })()}
                    <li><span>菜单图标:</span><span><i style={{fontStyle:'normal'}} onClick={()=> {
                        this.props.toggleIconSetting(this.props.targetMenuSort);
                    }} className={iconClassName}>{iContent}</i></span></li>
                </ul>
            </div>);

    }

    //渲染进度状态条
    createOptionMenuProgress() {
        let progressState = this.props.target.status.progress;
        if (progressState) {
            let stepOne = classNames({'active': progressState[0].active, 'now-on': progressState[0].on});
            let stepTwo = classNames({'active': progressState[1].active, 'now-on': progressState[1].on});
            let stepThree = classNames({'active': progressState[2].active, 'now-on': progressState[2].on});
            let stepFour = classNames({'active': progressState[3].active, 'now-on': progressState[3].on});
            if (this.props.isRootMenu) {
                return (<div className="option-menu-progress">
                    <ul>
                        <li style={{width: "100%", cursor: 'default',fontSize:'200%'}}
                            className="active singleProgress">节点菜单功能
                        </li>
                    </ul>
                </div>);
            } else {
                return (<div className="option-menu-progress">
                    <ul>
                        <li onClick={
                            ()=>{
                            if(progressState[0].active){
                                this.props.clickChangeSetp(this.props.targetMenuSort, 0);
                            }
                            }
                        } className={stepOne}><span>①</span>&nbsp;功能
                        </li>
                        <li onClick={
                            ()=>{
                            if(progressState[1].active){
                                this.props.clickChangeSetp(this.props.targetMenuSort, 1);
                            }
                            }
                        } className={stepTwo}><span>②</span>&nbsp;视图
                        </li>
                        <li onClick={
                            ()=>{
                            if(progressState[2].active){
                                this.props.clickChangeSetp(this.props.targetMenuSort, 2);
                            }
                            }
                        } className={stepThree}><span>③</span>&nbsp;按钮
                        </li>
                        <li onClick={
                            ()=>{
                            if(progressState[3].active){
                                this.props.clickChangeSetp(this.props.targetMenuSort, 3);
                            }
                            }
                        } className={stepFour}><span>④</span>&nbsp;添加修改
                        </li>
                    </ul>
                </div>);
            }
        }
    }

    //渲染页脚按钮
    createFooter() {
        let createFooterLastStepButton = ()=> {
            let progressState = this.props.target.status.progress;
            let lastStep = function () {
                for (let i in progressState) {
                    if (progressState[i].on) {
                        return --i;
                    }
                }
            }();
            if (!this.props.isRootMenu && lastStep > -1) {
                return (<button className="btn" onClick={
            ()=>{
                this.props.clickChangeSetp(this.props.targetMenuSort, lastStep);
            }
            }>上一步</button>);
            }
        }

        let createFooterNextStepButton = ()=> {
            let progressState = this.props.target.status.progress;
            let nextStep = function () {
                for (let i in progressState) {
                    if (progressState[i].on) {
                        return ++i;
                    }
                }
            }();
            if (!this.props.isRootMenu && nextStep < 4) {
                return (<button onClick={()=>{
                if(nextStep===1){
                    this.props.getViewPointConfig(this.props.targetMenuSort,this.props.menuData.viewPointConfigApi,this.props.target.obj.targetMenu,()=>{
                        this.props.clickNextStep(this.props.targetMenuSort, nextStep);
                    });
                }else if(nextStep===3){
                    let isPass = false;
                   this.props.menuData.btnGroup.map((v, k)=> {
                       if(v.componentName==='check'){
                           isPass = true;
                       }else if(v.componentName==='modify'){
                           isPass = true;
                       }
                    })
                    isPass?this.props.clickNextStep(this.props.targetMenuSort, nextStep):this.props.sendError(this.props.targetMenuSort, '必须至少含有一个模态框启动按钮！');
                }else{
                    this.props.clickNextStep(this.props.targetMenuSort, nextStep);
                }
            }} className="btn">下一步</button>);
            }
        }

        let createFooterFinishStepButton = ()=> {

            let handleFinishButton = ()=> {
                let menuData = this.props.menuData;
                switch (this.props.targetMenuSort) {
                    case 'menuSettingAddMenu':
                        if(!isOnline){
                            let allMenu = this.props.allMenu;
                            let createTime = getNowFormatDate();
                            let updateTime = getNowFormatDate();
                            let id = allMenu.length + 1;
                            let parentCode = '';
                            if (this.props.target.obj.targetMenu.code) {
                                parentCode = this.props.target.obj.targetMenu.code;
                            } else {
                                parentCode = '0';
                            }
                            let code = '';
                            let deCode = 1;
                            for (let i in allMenu) {
                                if (allMenu[i].parentCode === parentCode) {
                                    deCode++;
                                }
                            }
                            code = (parentCode === '0' ? '' : parentCode) + '' + deCode;
                            menuData.createtime = createTime;
                            menuData.updatetime = updateTime;
                            menuData.id = id;
                            menuData.code = code;
                        }
                        this.props.clickFinish(this.props.targetMenuSort,menuData,this.props.activeContent,this.props.nowOnContentKey,this.props.target.obj);
                        break;
                    case 'menuSettingEditMenu':
                        if(!isOnline){
                        }
                        this.props.clickFinish(this.props.targetMenuSort,menuData,this.props.activeContent,this.props.nowOnContentKey,this.props.target.obj,'modify');
                        break;
                }
            }

            let progressState = this.props.target.status.progress;
            let Step = function () {
                for (let i in progressState) {
                    if (progressState[i].on) {
                        return i;
                    }
                }
            }();
            if(this.props.targetMenuSort!=='menuSettingDetailMenu'){
                if (this.props.isRootMenu || Step === '3') {
                    return (<button onClick={()=>{
                handleFinishButton();
            }} className="btn btn-finish">完成</button>);
                }
            }
        }
        let createFooterModifyViewPointPreview = ()=> {
            let progressState = this.props.target.status.progress;
            let Step = function () {
                for (let i in progressState) {
                    if (progressState[i].on) {
                        return i;
                    }
                }
            }();
            if (Step === '3') {
                return (<button onClick={()=>{
                    this.props.changePreviewStatus(this.props.targetMenuSort,this.props.previewStatus);
                }} className="btn">预览</button> );
            }
        }

        return (<div className="option-menu-footer">
            <div className="btn-group">
                {createFooterLastStepButton()}
                {createFooterNextStepButton()}
                {createFooterFinishStepButton()}
                {createFooterModifyViewPointPreview()}
            </div>
        </div>);

    }

    //渲染图标设置遮罩层
    createToggleIconSetting() {
        if (this.props.target.status.isToggleIconSetting) {
            return (
                <div className="shield">
                    <div className="shield-content">
                        <ul>
                            {
                                (()=> {
                                    return IconList.IconList.map((e, k)=> {
                                        if (e.name === '') {
                                            return (<li key={k}><i onClick={()=>{
                                                this.props.toggleIconSetting(this.props.targetMenuSort,e.name)
                                            }} style={{fontStyle:'normal'}}>空</i></li> );
                                        }
                                        return (<li key={k}><i onClick={()=>{
                                            this.props.toggleIconSetting(this.props.targetMenuSort,e.name)
                                        }} className={'fa '+e.name}></i></li> );
                                    });
                                })()
                            }
                        </ul>
                    </div>
                </div>
            );
        }
    }

    //渲染添加修改预览遮罩层
    createModifyShield() {
        if (this.props.target.status.menuData) {
            return (<ModifyShield onCancel={()=>{
                this.props.changePreviewStatus(this.props.targetMenuSort,this.props.previewStatus);
            }
            } key={this.props.previewStatus} isShow={this.props.previewStatus}
                                  fieldData={this.props.target.status.menuData.modifyViewPoint}></ModifyShield>);
        }
    }
    //渲染级联搜索按钮详细配置遮罩层
    createSearchButtonModify(){
        if(this.props.O_buttonConfigPreviewStatus){
            return (<ModifySearchGroupConfig onOk={e=>{
                this.props.changeMenuData(this.props.targetMenuSort, 'btnGroup', e);
            }} tableData={this.props.viewPointConfigData} target={this.props.targetMenuSort} config={this.props.O_buttonConfigPreviewStatus}></ModifySearchGroupConfig>);
        }
    }



    renderPC() {
        let height = this.props.height;
        let bodyHeight = height - 150;
        return (
            <div className="content-container animation-fadeInRight">
                {this.createSearchButtonModify()}
                {this.createModifyShield()}
                {this.createToggleIconSetting()}
                <ShieldAlert key={this.props.targetMenuSort+''+this.props.target.status.error} title="Alert" content={this.props.target.status.error} onTargetMenuTarget={this.props.targetMenuSort}></ShieldAlert>
                <div className="content-container-inset" style={{height: height}}>
                    <div style={{minWidth: 600}}>
                        {this.createOptionMenuProgress()}
                        <div style={{height: bodyHeight, clear: "both"}} className="content-setting-frame">
                            {this.judgeRenderFunction()}
                        </div>
                        {this.createFooter()}
                    </div>
                </div>
            </div>
        );

    }

    render() {
        switch (this.props.defaultToggleStatus) {
            case 'none':
                return (<div></div>);
                break;
        }
        return this.renderPC();

    }
}

const state = state=> {
    let target, nowOnContentKey,menuData;
    state.containerTitleMenu.activeContent.map((v, k)=> {
        if (v.obj.id === state.common.nowOnContentTarget.id) {
            target = v;
            nowOnContentKey = k;
        }
    });

    return ({
        allMenu: state.sideBar.menu,
        activeContent: state.containerTitleMenu.activeContent,
        //本选项卡头包含的选项卡内数据{obj:选项卡菜单，status：选项卡内状态，isActive:是否正使用}
        target: target,
        //视图层通过菜单视图项Api获取的表字段内容
        viewPointConfigData: target.status.viewPointConfigData?target.status.viewPointConfigData:[],
        //是否开启预览遮罩层
        previewStatus: target.status?target.status.previewStatus:'',
        //是否开启按钮详细配置遮罩层
        O_buttonConfigPreviewStatus: target.status ? target.status.O_buttonConfigPreviewStatus : '',
        //当前选项卡所在数组的位置，用来关闭本选项卡
        nowOnContentKey: nowOnContentKey,
        isRootMenu: target.status?target.status.isRootMenu:'',
        configApi: target.status?target.status.configApi:'',
        targetMenuSort: target.status?target.obj.menuSort:'',
        menuData: target.status?target.status.menuData:'',
        defaultToggleStatus: state.common.defaultToggleStatus
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(MenuSettingOptionAddMenu);

