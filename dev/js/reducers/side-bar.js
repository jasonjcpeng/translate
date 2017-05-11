import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    userInfo: {
        userID:'',
        name: '',
        power: '',
        imgUrl: '',
        powerEnCode:''
    },
    menu: [],
    menuScrollY: 0,
    activeMenu: [],
    miniHoverMenu:[]
}
export default function (state = initState, action) {
    switch (action.type) {
        case Constants.APP_RELOAD_FROM_LOCAL_STORAGE:
            return update(state, {
                userInfo: {$set: action.payload.sideBar.userInfo},
                menu: {$set: action.payload.sideBar.menu}
            });
        case Constants.INIT_CONTAINER_APP_DID_MOUNT:
            if(action.payload){
                return update(state, {
                    userInfo: {$set: action.payload.userInfo},
                    menu: {$set: action.payload.menu}
                });
            }
            break;
        case Constants.SIDE_BAR_MENU_SCROLL:
            return update(state, {menuScrollY: {$set: action.payload}})
            break;
        case Constants.SIDE_BAR_MENU_ITEM_TOGGLE:
            let length = state.activeMenu.length;
            if(!isNaN(action.payload.menuSort)){
                if (length === 0) {
                    return update(state, {activeMenu: {$set: [action.payload]}});
                } else {
                    for (let i = 0; i < length; i++) {
                        if (state.activeMenu[i].parentCode === action.payload.parentCode) {
                            if(state.activeMenu[i].id===action.payload.id){
                                return update(state, {activeMenu: {$splice: [[i, length]]}});
                                break;
                            }else{
                                return update(state, {activeMenu: {$splice: [[i, length, action.payload]]}});
                                break;
                            }
                        }
                    }
                    return update(state, {activeMenu: {$push: [action.payload]}});
                    break;
                }
            }
            break;
        case Constants.SIDE_BAR_MINI_MENU_HOVER_MENU:
            if(action.payload===''){
                return update(state,{miniHoverMenu:{$set:[]}});
            }else{
                let isPush = true;
                state.miniHoverMenu.map(v=>{
                    if(v.parentCode===action.payload.parentCode){
                        isPush = false;
                    }
                });
                if(isPush){
                    return update(state,{miniHoverMenu:{$push:[action.payload]}});
                }else{
                    let length = state.miniHoverMenu.length;
                    for (let i = 0; i < length; i++) {
                        if (state.miniHoverMenu[i].parentCode === action.payload.parentCode) {
                                return update(state, {miniHoverMenu: {$splice: [[i, length, action.payload]]}});
                                break;
                            }
                        }
                }
            }
            break;
        case Constants.CONTENT_SETTING_CHANGE_MENU:
            return update(state,{menu:{$apply:arr=>{
                return arr.map(v=>{
                    if(v.id===action.payload.id){
                        return action.payload;
                    }else{
                        return v;
                    }
                });
            }}});
            break;
        case Constants.APP_DELETE_MENU_ITEM:
        function deleteMenu(state, id, parentCode) {
            if (id !== '') {
                let newParentCode = '';
                let newState = update(state, {
                    menu: {
                        $apply: arr=> {
                            return arr.filter(v=> {
                                if (v.id !== id) {
                                    return v;
                                } else {
                                    newParentCode = v.code;
                                }
                            });
                        }
                    }
                });
                return deleteMenu(newState, '', newParentCode);
            } else if (parentCode !== '') {
                let newParentCode = '';
                let newState = update(state, {
                    menu: {
                        $apply: arr=> {
                            return arr.filter(v=> {
                                if (v.parentCode !== parentCode) {
                                    return v;
                                } else {
                                    newParentCode = v.code;
                                }
                            });
                        }
                    }
                });
                return deleteMenu(newState, '', newParentCode);
            } else {
                return state;
            }
        }
            return deleteMenu(state, action.payload.id, '');
            break;
        case Constants.MENU_SETTING_ADD_MENU_TO_SIDE_BAR:
            if(action.payload){
                return update(state, {menu: {$push: [action.payload]}});
            }
            break;
        case Constants.CONTENT_SETTING_CHANGE_USER_INFO:
            return update(state, {userInfo: {$apply:arr=>{
                for(let i in arr){
                    if(action.userInfo[i]){
                        arr[i] = action.userInfo[i];
                    }
                }
                return arr;
            }}});
            break;
        case Constants.CONTENT_SETTING_CHANGE_QUICK_BUTTON:
            return update(state,{userInfo:{quickButton:{$apply:arr=>{
                let flag = true
                let orign = arr.filter(v=>{
                    if(v.id===action.quickButton.id){
                        flag = false;
                    }else{
                        return v;
                    }
                });
                if(flag){
                    orign.push(action.quickButton);
                }
                return orign;

            }}}});
            break;
    }
    return state;
}
