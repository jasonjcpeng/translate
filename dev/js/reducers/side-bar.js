import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    userInfo:{
        name:'',
        power:'',
        imgUrl:''
    },
    menu: [{icon: '', item_1: '', item_2: ''}],
    menuScrollY: 0,
    activeMenuId: []
}
export default function (state=initState,action) {
    switch (action.type){
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
            if (action.parentCode === '0') {
                return update(state, {activeMenuId: {$set: [action.payload]}});
            } else if (!action.isHasChild) {
                return update(state, {
                    activeMenuId: {
                        $apply: function (v) {
                            return v.map((v)=> {
                                if (v.parentCode === action.parentCode) {
                                    return action.payload;
                                } else {
                                    return v;
                                }
                            });
                        }
                    }
                });
            } else {
                return update(state, {activeMenuId: {$push: [action.payload]}});
            }
            break;
    }
    return state;
}
