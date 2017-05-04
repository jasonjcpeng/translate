import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';
import {isOnline} from '../config/config';

const initState = {
    menuScrollX: 0,
    activeContent: [],
    sideBarCheck: true,
    limit: 0,
    cursor: 0,
    contentWidth: 0,
    closeOptionToggle: false
}
const constID = 'AX_Id';
const constParentID='AX_ParentId';


const setActiveContentStatus = (state, menuSort, data)=>{
    return update(state, {
        activeContent: {
            $apply: function (arr) {
                return arr.map(function (v) {
                    if (v.obj.menuSort === menuSort) {
                        return update(v, data);
                    } else {
                        return v;
                    }
                });
            }
        }
    });
}

const setActiveContentStatusByID = (state,id,data)=>{
    return update(state, {
        activeContent: {
            $apply: function (arr) {
                return arr.map(function (v) {
                    if (v.obj.id === id) {
                        return update(v, data);
                    } else {
                        return v;
                    }
                });
            }
        }
    });
}

export default function (state = initState, action) {
    switch (action.type) {
        case Constants.APP_RELOAD_FROM_LOCAL_STORAGE:
            return action.payload.containerTitleMenu;
        case Constants.CONTAINER_TITTLE_MENU_SCROLL:
            return update(state, {menuScrollX: {$set: action.payload}});
            break;
        case Constants.SIDE_BAR_MENU_ITEM_TOGGLE:
            if (!action.isNoView) {
                let Push = true;
                let newState = update(state, {
                    activeContent: {
                        $apply: function (arr) {
                            if (arr.length > 0) {
                                return arr.map(function (v) {
                                    if (v.obj.id === action.payload.id) {
                                        Push = false;
                                        return {
                                            obj: action.payload,
                                            active: true,
                                            status: v.status
                                        }
                                    } else {
                                        return {
                                            obj: v.obj,
                                            active: false,
                                            status: v.status
                                        }
                                    }
                                })
                            } else {
                                return [];
                            }
                        }
                    }, sideBarCheck: {$set: true}
                });
                if (Push) {
                    return update(newState, {
                        activeContent: {
                            $push: [{
                                obj: action.payload,
                                active: true,
                                status: false
                            }]
                        }
                    });
                } else {
                    return newState;
                }
            }
            break;
        case Constants.CONTAINER_TITTLE_MENU_SET_LIMIT_AND_CURSOR:
            if (state.sideBarCheck) {
                return update(state, {
                    sideBarCheck: {$set: false},
                    limit: {$set: action.limit},
                    cursor: {$set: action.cursor},
                    menuScrollX: {$set: action.cursor}
                });
            } else {
                return update(state, {limit: {$set: action.limit}, cursor: {$set: action.cursor}});
            }
            break;
        case Constants.CONTAINER_TITTLE_MENU_SELECT_ACTIVE_CONTENT:
            return update(state, {
                activeContent: {
                    $apply: function (arr) {
                        return arr.map(function (v) {
                            if (v.obj.id === action.payload.obj.id) {
                                return ({
                                    obj: v.obj,
                                    active: true,
                                    status: v.status
                                });
                            } else {
                                return ({
                                    obj: v.obj,
                                    active: false,
                                    status: v.status
                                });
                            }

                        });
                    }
                }, sideBarCheck: {$set: true}
            });
            break;
        case Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT:
            return update(state, {activeContent: {$splice: [[action.key, 1]]}});
            break;
        case Constants.CONTAINER_TITTLE_MENU_CLOSE_OPTION:
            return update(state, {closeOptionToggle: {$set: !state.closeOptionToggle}});
            break;
        case Constants.CONTAINER_TITTLE_MENU_FORK_ACTIVE_ITEM:
            return update(state, {sideBarCheck: {$set: true}});
            break;
        case Constants.CONTAINER_TITTLE_MENU_CLOSE_ALL_ITEM:
            return update(state, {activeContent: {$set: []}});
            break;
        case Constants.CONTAINER_TITTLE_MENU_CLOSE_OTHER_ITEM:
            return update(state, {
                activeContent: {
                    $apply: function (arr) {
                        return arr.filter(function (v) {
                            if (v.active) {
                                return v;
                            }
                        });
                    }
                }
            });
            break;
        //---------------contentSetting------------------------------
        case Constants.CONTENT_SETTING_INIT:
            let initContentSetting = {
                error: undefined,
                ok:undefined,
                rightActiveContent: {key: 'baseInfo', name: '基本信息'},
                defaultMenuSettingTableToggleItem: ['0'],
                selectMenuSettingTableItem: undefined
            }
            if (action.error) {
                initContentSetting.error = action.error;
            }
            return setActiveContentStatus(state, 'setting', {status: {$set: initContentSetting}});
            break;
        case Constants.CONTENT_SETTING_CHECK_RIGHT_ACTIVE_CONTAINER:
            return setActiveContentStatus(state, action.menuSort, {status: {rightActiveContent: {$set: action.payload}}});
            break;
        case Constants.CONTENT_SETTING_CHANGE_MENU:
            /*修改菜单内容
             * payload:obj 修改后的菜单
             * */
            return update(state, {
                activeContent: {
                    $apply: arr=> {
                        return arr.map(v=> {
                            if (v.obj.id === action.payload.id) {
                                return action.payload;
                            } else {
                                return v;
                            }
                        });
                    }
                }
            });
            break;
        case Constants.CONTENT_SETTING_SETTING_MENU_TOGGLE_TABLE_MENU_ITEM:
            let newStat = setActiveContentStatus(state, 'setting', {status: {selectMenuSettingTableItem: {$set: undefined}}});
            return setActiveContentStatus(newStat, 'setting', {
                status: {
                    defaultMenuSettingTableToggleItem: {
                        $apply: arr=> {
                            let isPush = true;
                            let newArr = arr.filter((v)=>{
                                if(v!==action.payload){
                                    return v;
                                }else{
                                    isPush = false;
                                }
                            });
                            if(isPush){
                                newArr.push(action.payload);
                            }
                            return newArr;
                        }
                    }
                }
            });
            break;
        case Constants.CONTENT_SETTING_SETTING_MENU_TOGGLE_OFF_MENU_ITEM:
            return setActiveContentStatus(state, 'setting', {
                status: {
                    defaultMenuSettingTableToggleItem: {$set: ["0"]},
                    selectMenuSettingTableItem: {$set: undefined}
                }
            });
            break;
        case Constants.CONTENT_SETTING_SETTING_MENU_SELECT_TABLE_MENU_ITEM:
            return setActiveContentStatus(state, 'setting', {status: {selectMenuSettingTableItem: {$set: action.payload}}});
            break;
        case Constants.APP_DELETE_MENU_ITEM:
            let newState = update(state, {
                activeContent: {
                    $apply: arr=> {
                        return arr.filter(v=> {
                            if (v.obj.id !== action.payload.id) {
                                return v;
                            }
                        });
                    }
                }
            });
            return setActiveContentStatus(newState, 'setting', {status: {selectMenuSettingTableItem: {$set: undefined}}});
            break;
        case Constants.CONTENT_SETTING_SETTING_MENU_SEND_ERROR:
            return setActiveContentStatus(state, 'setting', {status: {error: {$set: action.error}}});
            break;
        case Constants.CONTENT_SETTING_SETTING_IS_OK:
            return setActiveContentStatus(state, 'setting', {status: {ok: {$set: action.ok}}});
            break;
        //---------------MenuSettingOption------------------------------
        case Constants.MENU_SETTING_OPTION_MENU_DID_MOUNT:
            let parentCode = action.target.targetMenu === '0' ? '0' : action.target.targetMenu.code;
            let initMenuSettingOption = {
                previewStatus:false,
                error: undefined,
                ok:undefined,
                isRootMenu: undefined,
                isToggleIconSetting: false,
                progress: [{active: true, on: true}, {active: false, on: false}, {
                    active: false,
                    on: false
                }, {active: false, on: false}],
                viewPointConfigData: [],
                isFinish:false,
                menuData: {
                    id: '',
                    icon: '',
                    code: '',
                    parentCode: parentCode,
                    menuName: '',
                    menuSort: 0,
                    isEnable: true,
                    createtime: '',
                    updatetime: '',
                    api: isOnline?'':'api/module/getmenu',
                    viewPointConfigApi:isOnline?'':'api/configApi2',
                    viewPoint: [],
                    btnGroup: [],
                    modifyViewPoint: []
                }
            }
            if (action.error) {
                initMenuSettingOption.error = action.error;
                return setActiveContentStatus(state, action.target.menuSort, {status: {$set: initMenuSettingOption}});
            }
            if (action.target.menuSort ==='menuSettingAddMenu') {
                return setActiveContentStatus(state, action.target.menuSort, {status: {$set: initMenuSettingOption}});
            } else {
                let menuData = action.target.targetMenu;
                if (menuData.viewPoint.length>0) {
                    let viewPointConfigApi = menuData.api.split('api/')[1];
                    menuData.viewPointConfigApi = 'sys_' + viewPointConfigApi.substring(0, viewPointConfigApi.indexOf('/'));
                }else{
                    menuData.viewPointConfigApi ='';
                }
                initMenuSettingOption.menuData = menuData;

                return setActiveContentStatus(state, action.target.menuSort, {status: {$set: initMenuSettingOption}});
            }
            break;
        case Constants.MENU_SETTING_OPTION_CHECK_IS_ROOT_MENU:
            return setActiveContentStatus(state, action.targetMenuSort, {status: {isRootMenu: {$set: action.payload}}});
            break;
        case Constants.MENU_SETTING_OPTION_ONCLICK_NEXT_STEP:
            return setActiveContentStatus(state, action.targetMenuSort, {
                status: {
                    progress: {
                        $splice: [[action.payload - 1, 2, {
                            active: true,
                            on: false
                        }, {active: true, on: true}]]
                    }
                }
            })
            break;
        case Constants.MENU_SETTING_OPTION_ONCLICK_CHANGE_STEP:
            return setActiveContentStatus(state, action.targetMenuSort, {
                status: {
                    progress: {
                        $apply: arr=> {
                            return arr.map((val, k)=> {
                                if (k === action.payload) {
                                    return {active: true, on: true};
                                } else {
                                    return {active: val.active, on: false}
                                }
                            });
                        }
                    }
                }
            });
            break;
        case Constants.MENU_SETTING_TOGGLE_ICON_SETTING:
            if (action.icon !== undefined) {
                return setActiveContentStatus(state, action.targetMenuSort, {
                    status: {
                        isToggleIconSetting: {
                            $apply: bol=> {
                                return !bol;
                            }
                        }, menuData: {icon: {$set: action.icon}}
                    }
                });
            } else {
                return setActiveContentStatus(state, action.targetMenuSort, {
                    status: {
                        isToggleIconSetting: {
                            $apply: bol=> {
                                return !bol;
                            }
                        }
                    }
                });
            }
            break;
        case Constants.MENU_SETTING_CHANGE_MENU_DATA:
            return setActiveContentStatus(state, action.targetMenuSort, {
                status: {
                    menuData: {
                        $apply: obj=> {
                            for (let i in obj) {
                                if (i === action.key) {
                                        obj[i] = action.value;
                                }
                            }
                            return obj;
                        }
                    }
                }
            });
            break;
        case Constants.MENU_SETTING_GET_VIEW_POINT_CONFIG:
            if (action.error) {
                return setActiveContentStatus(state, action.targetMenuSort, {status: {error: {$set: "来自菜单视图项API:" + action.error}}})
            } else {
                return setActiveContentStatus(state, action.targetMenuSort, {status: {viewPointConfigData: {$set: action.payload}}})
            }
            break;
        case Constants.MENU_SETTING_SEND_ERROR_MESSAGE:
            return setActiveContentStatus(state, action.targetMenuSort, {status: {error: {$set: action.error}}});
            break;
        case Constants.SHIELD_ALERT_ON_OK_DELETE_ERROR_FLAG:
            if(action.target==='setting'){
                return setActiveContentStatus(state, action.target, {status: {error: {$set: undefined}}});
            }
            if(action.targetType){
                return setActiveContentStatus(state, action.target, {status: {error: {$set: undefined}}});
            }else{
                return setActiveContentStatusByID(state,action.target,{status:{error: {$set: undefined}}});
            }

            break;
        case Constants.SHIELD_OK_ON_OK_DELETE_OK_FLAG:
            if(action.target==='setting'){
                return setActiveContentStatus(state, action.target, {status: {ok: {$set: undefined}}});
            }
            if(action.targetType){
                return setActiveContentStatus(state, action.target, {status: {ok: {$set: undefined}}});
            }else{
                return setActiveContentStatusByID(state,action.target,{status:{ok: {$set: undefined}}});
            }

            break;
        case Constants.MENU_SETTING_CHANGE_PREVIEW_STATUS:
            return setActiveContentStatus(state, action.targetMenuSort, {status: {previewStatus: {$set: action.previewStatus}}});
            break;
        case Constants.MENU_SETTING_ADD_MENU_FINISH:
            return setActiveContentStatus(state, action.targetMenuSort, {status: {error: {$set: action.error}}});
            break;
        case Constants.MENU_SETTING_MODIFY_MENU_FINISH:
            return setActiveContentStatus(state, action.targetMenuSort, {status: {error: {$set: action.error}}});
            break;
        //-----------------------------normal-table-----------------------------------
        case Constants.NORMAL_TABLE_INIT:
            let initStatus = {
                error:undefined,
                loaded:false,
                data:[],
                checkOnItem:undefined,
                nowOnClickButton:undefined,
                modifyViewData:undefined,
                toggleItem:[],
                tableConfigArgs: action.initTableArgs,
                batchOnItem: [],
                roleAuthorize:{
                    currentToggleItem:[],
                    batchOnItem:[]
                }
            }

            return setActiveContentStatusByID(state,action.targetID,{status:{$set:initStatus}});
            break;
        case Constants.SHIELD_BUTTON_GROUP_ROLE_AUTHORIZE_TOGGLE_STATUS:
            return setActiveContentStatusByID(state,action.targetID,{status:{roleAuthorize:{currentToggleItem:{$apply:(arr)=>{
                let isPushFlag = true;
                let newArr = arr.filter(v=>{
                    if(action.code===v){
                        isPushFlag = false;
                    }else{
                        return v;
                    }
                });
                if(isPushFlag){
                    newArr.push(action.code);
                }
                return newArr;
            }}}}});
            break;
        case Constants.SHIELD_BUTTON_GROUP_ROLE_AUTHORIZE_BATCH_SELECT_ITEM:
            return setActiveContentStatusByID(state, action.targetID, {
                status: {
                    roleAuthorize: {
                        batchOnItem: {
                            $apply: (arr)=> {
                                let resultArr = [];
                                let originArr = arr;
                                if (action.onBatchItem.length > 2) {
                                    if (arr.length === action.onBatchItem.length) {
                                        resultArr = [];
                                    } else {
                                        resultArr = action.onBatchItem;
                                    }
                                } else {
                                    let tempResult = [];
                                    for (let i in action.onBatchItem) {
                                        let isPush = true;
                                        for (let l in arr) {
                                            if (action.onBatchItem[i].id === arr[l].id) {
                                                originArr.splice(l, 1);
                                                isPush = false;
                                            }
                                        }
                                        if (isPush) {
                                            tempResult.push(action.onBatchItem[i]);
                                        }
                                    }
                                    resultArr = tempResult.concat(originArr);
                                }
                                return resultArr;
                            }
                        }
                    }
                }
            });
            break;
        case Constants.NORMAL_TABLE_GET_DATA:
            let loaded = action.error?false:true;
            return setActiveContentStatusByID(state,action.targetID,{status:{tableConfigArgs:{$set:action.data?action.data.tablePagination:undefined},data:{$set:action.data?action.data.tableData:undefined},loaded:{$set:loaded},error:{$set:action.error}}});
            break;
        case Constants.NORMAL_TABLE_CHECK_ON_ITEM:
            return setActiveContentStatusByID(state,action.targetID,{status:{checkOnItem:{$set:action.item}}});
            break;
        case Constants.NORMAL_TABLE_ON_CLICK_BUTTON:
            return setActiveContentStatusByID(state,action.targetID,{status:{nowOnClickButton:{$set:action.buttonName}}});
            break;
        case Constants.NORMAL_TABLE_SAVE_MODIFY_VIEW_DATA:
            return setActiveContentStatusByID(state,action.targetID,{status:{modifyViewData:{$set:action.modifyViewData}}});
            break;
        case Constants.NORMAL_TABLE_SUBMIT_MODIFY_DATA:
            return setActiveContentStatusByID(state,action.targetID,{status:{data:{$apply:(arr)=>{
                return arr.map((v,k)=>{
                    if(v[constID]===action.data[constID]){
                        return action.data;
                    }else{
                        return v
                    }
                });
            }}}});
            break;
        case Constants.NORMAL_TABLE_SUBMIT_DELETE_DATA:
            return setActiveContentStatusByID(state,action.targetID,{status:{data:{$apply:(arr)=>{
                if(Object.prototype.toString.call(action.data)==='[object Array]'){
                    //批量删除
                    return arr;
                }else{
                    return arr.filter((v,k)=>{
                        if(action.data&&v[constID]===action.data[constID]){

                        }else{
                            return v;
                        }
                    });
                }
            }},batchOnItem:{$apply:(arr)=>{
                if(Object.prototype.toString.call(action.data)==='[object Array]'){
                    //批量删除
                    return [];
                }else{
                    return arr.filter((v,k)=>{
                        if(action.data&&v[constID]===action.data[constID]){
                        }else{
                            return v;
                        }
                    });
                }
            }},error:{$set:action.error}}});
            break;
        case Constants.NORMAL_TABLE_TOGGLE_ITEM:
            return setActiveContentStatusByID(state,action.targetID,{status:{toggleItem:{$apply:(arr)=>{
                let isPush = true;
                let newArr = arr.filter((v)=>{
                    if(v[constID]!==action.item[constID]){
                        return v;
                    }else{
                        isPush = false;
                    }
                });
                if(isPush){
                    newArr.push(action.item);
                }
                return newArr;
            }}}});
            break;
        case Constants.NORMAL_TABLE_SUBMIT_ADD_DATA:
                    return setActiveContentStatusByID(state,action.targetID,{status:{data:{$apply:(arr)=>{
                      arr.push(action.data);
                        return arr;
                    }},error:{$set:action.error}}});
            break;
        case Constants.NORMAL_TABLE_SUBMIT_TABLE_TOGGLE_OPTION:
            if(action.error){
                return setActiveContentStatusByID(state,action.targetID,{status:{error:{$set:action.error}}});
            }else{
                return setActiveContentStatusByID(state,action.targetID,{status:{data:{$apply:(arr)=>{
                    return arr.map((v,k)=>{
                        if(v[constID]===action.item[constID]){
                            v[action.bindField] = action.nowOnState;
                            return v;
                        }else{
                            return v;
                        }
                    });
                }},error:{$set:action.error}}});
            }
            break;
        case Constants.NORMAL_TABLE_BATCH_SELECT_ITEM:
            return setActiveContentStatusByID(state, action.targetID, {
                status: {
                    batchOnItem: {
                        $apply: (arr)=> {
                            let resultArr = [];
                            let originArr = arr;
                            if(action.onBatchItem.length>2){
                                if(arr.length === action.onBatchItem.length){
                                    resultArr = [];
                                }else{
                                    resultArr = action.onBatchItem;
                                }
                            }else{
                                let tempResult = [];
                                for (let i in action.onBatchItem) {
                                    let isPush = true;
                                    for (let l in arr) {
                                        if (action.onBatchItem[i][constID] === arr[l][constID]) {
                                            originArr.splice(l, 1);
                                            isPush = false;
                                        }
                                    }
                                    if (isPush) {
                                        tempResult.push(action.onBatchItem[i]);
                                    }
                                }
                                resultArr = tempResult.concat(originArr);
                            }
                            return resultArr;
                        }
                    }
                }
            });

            break;
    }
    return state;
}


