import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    menuScrollX: 0,
    activeContent: [],
    sideBarCheck: true,
    limit: 0,
    cursor: 0,
    contentWidth: 0,
    closeOptionToggle: false
}



function setActiveContentStatus(state,menuSort,data){
    return update(state,{
        activeContent: {
            $apply: function (arr) {
                return arr.map(function(v){
                    if(v.obj.menuSort===menuSort){
                        return update(v,data);
                    }else{
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
                rightActiveContent:{key:'baseInfo',name:'基本信息'},
                defaultMenuSettingTableToggleItem:['0'],
                selectMenuSettingTableItem:undefined
            }
            if (action.error) {
                initContentSetting.error=action.error;
            }
            return setActiveContentStatus(state,'setting',{status:{$set:initContentSetting}});
            break;
        case Constants.CONTENT_SETTING_CHECK_RIGHT_ACTIVE_CONTAINER:
            return setActiveContentStatus(state,action.menuSort,{status:{rightActiveContent:{$set:action.payload}}});
            break;
        case Constants.CONTENT_SETTING_CHANGE_MENU:
            /*修改菜单内容
            * payload:obj 修改后的菜单
            * */
            return update(state,{activeContent:{$apply:arr=>{
                return arr.map(v=>{
                    if(v.obj.id===action.payload.id){
                        return action.payload;
                    }else{
                        return v;
                    }
                });
            }}});
        break;
        case Constants.CONTENT_SETTING_SETTING_MENU_TOGGLE_TABLE_MENU_ITEM:
            let newStat = setActiveContentStatus(state,'setting',{status:{selectMenuSettingTableItem:{$set:undefined}}});
            return setActiveContentStatus(newStat,'setting',{status:{defaultMenuSettingTableToggleItem:{$apply:arr=>{
                let isPush = true;
                let newArr = [];
                let DelArr = [];
                let root = '';
                for(let i in arr){
                    if(arr[i]===action.payload){
                        isPush = false;
                        root = action.payload;
                        DelArr.push(arr[i]);
                    }
                    if(root){
                        if(arr[i]!==action.payload&&arr[i].slice(0,root.length)===root){
                            DelArr.push(arr[i]);
                            isPush = false;
                        }
                    }
                }
                newArr = arr.filter(i=>{return DelArr.indexOf(i) < 0;});
                if(isPush){
                    newArr.push(action.payload);
                    return newArr;
                }else{
                    return newArr;
                }
            }}}});
        break;
        case Constants.CONTENT_SETTING_SETTING_MENU_TOGGLE_OFF_MENU_ITEM:
            return setActiveContentStatus(state,'setting',{status:{defaultMenuSettingTableToggleItem:{$set:["0"]},selectMenuSettingTableItem:{$set:undefined}}});
            break;
        case Constants.CONTENT_SETTING_SETTING_MENU_SELECT_TABLE_MENU_ITEM:
            return setActiveContentStatus(state,'setting',{status:{selectMenuSettingTableItem:{$set:action.payload}}});
        break;
        case Constants.APP_DELETE_MENU_ITEM:
            let newState =  update(state,{activeContent:{$apply:arr=>{
                return arr.filter(v=>{
                    if(v.obj.id!==action.payload.id){
                        return v;
                    }
                });
            }}});
            return setActiveContentStatus(newState,'setting',{status:{selectMenuSettingTableItem:{$set:undefined}}});
            break;
        //---------------MenuSettingOption------------------------------
        case Constants.MENU_SETTING_OPTION_MENU_DID_MOUNT:
            let parentCode = action.target.targetMenu === '0'?'0':action.target.targetMenu.code;
            let initMenuSettingOption = {
                error: undefined,
                isRootMenu:undefined,
                isToggleIconSetting:false,
                progress:[{active:true,on:true},{active:false,on:false},{active:false,on:false},{active:false,on:false}],
                viewPointConfigData:{},
                menuData:{
                    id: '',
                    icon:'',
                    code: '',
                    parentCode: parentCode,
                    menuName: '',
                    menuSort: 0,
                    isEnable: true,
                    createtime: '',
                    updatetime: '',
                    api:'',
                    viewPointConfigApi:'',
                    viewPoint:{

                    },
                    btnGroup:{

                    },
                    modifyViewPoint:{

                    }
                }
            }
            if (action.error) {
                initMenuSettingOption.error=action.error;
                return setActiveContentStatus(state,action.target.menuSort,{status:{$set:initMenuSettingOption}});
            }
            return setActiveContentStatus(state,action.target.menuSort,{status:{$set:initMenuSettingOption}});
            break;
        case Constants.MENU_SETTING_OPTION_CHECK_IS_ROOT_MENU:
            return setActiveContentStatus(state,action.targetMenuSort,{status:{isRootMenu:{$set:action.payload}}});
            break;
        case Constants.MENU_SETTING_OPTION_ONCLICK_NEXT_STEP:
            return setActiveContentStatus(state,action.targetMenuSort,{status:{progress:{$splice:[[action.payload-1,2,{active:true,on:false},{active:true,on:true}]]}}})
            break;
        case Constants.MENU_SETTING_OPTION_ONCLICK_CHANGE_STEP:
            return setActiveContentStatus(state,action.targetMenuSort,{status:{progress:{$apply:arr=>{
                return arr.map((val,k)=>{
                    if(k===action.payload){
                        return {active:true,on:true};
                    }else{
                        return {active:val.active,on:false}
                    }
                });
            }}}});
            break;
        case Constants.MENU_SETTING_TOGGLE_ICON_SETTING:
            if(action.icon!==undefined){
                return setActiveContentStatus(state,action.targetMenuSort,{status:{isToggleIconSetting:{$apply:bol=>{
                    return !bol;
                }},menuData:{icon:{$set:action.icon}}}});
            }else{
                return setActiveContentStatus(state,action.targetMenuSort,{status:{isToggleIconSetting:{$apply:bol=>{
                    return !bol;
                }}}});
            }
            break;
        case Constants.MENU_SETTING_CHANGE_MENU_DATA:
            switch(action.progressName){
                case 'setUp':
                    return setActiveContentStatus(state,action.targetMenuSort,{status:{menuData:{$apply:obj=>{
                        for(let i in obj){
                            if(i===action.key){
                                obj[i]=action.value;
                            }
                        }
                        return obj;
                    }}}});
                    break;
                case 'viewPoint':
                    break;
                case 'btnGroup':
                    break;
                case 'modifyViewPoint':
                    break;
            }
            break;
        case Constants.MENU_SETTING_GET_VIEW_POINT_CONFIG:
            if(action.error){
                return setActiveContentStatus(state,action.targetMenuSort,{status:{error:{$set:action.error}}})
            }else{
                return setActiveContentStatus(state,action.targetMenuSort,{status:{viewPointConfigData:{$set:action.payload}}})
            }
            break;


    }
    return state;
}


