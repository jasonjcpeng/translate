import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    userInfo: {
        name: '',
        power: '',
        imgUrl: ''
    },
    menu: [{icon: '', item_1: '', item_2: ''}],
    menuScrollY: 0,
    activeMenu: []
}
export default function (state = initState, action) {
    switch (action.type) {
        case Constants.INIT_CONTAINER_APP_DID_MOUNT:
            return update(state, {
                userInfo: {$set: action.payload.sideBar.userInfo},
                menu: {$set: action.payload.sideBar.menu}
            });
            break;
        case Constants.SIDE_BAR_MENU_SCROLL:
            return update(state, {menuScrollY: {$set: action.payload}})
            break;
        case Constants.SIDE_BAR_MENU_ITEM_TOGGLE:
            let length = state.activeMenu.length;
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
            break;
    }
    return state;
}
