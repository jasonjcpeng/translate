import update from 'react-addons-update';
import * as Constants from '../action/CONSTANTS';

const initState = {
    loaded: false,
    error: undefined,
    useSkin: '',
    windowHeight: 0,
    windowWidth: 0,
    nowOnContentTarget: null,
    toggleStatus: '',
    defaultToggleStatus: '',
    lastToggleStatus: '',
    isFullScreen: false
};

export default function (state = initState, action) {
    switch (action.type) {
        case Constants.APP_RELOAD_FROM_LOCAL_STORAGE:
            return action.payload.common;
        case Constants.INIT_CONTAINER_APP_DID_MOUNT:
            let error = undefined;
            if (action.error) {
                error = action.error;
            }
            return update(state, {loaded: {$set: true}, error: {$set: action.error},useSkin: {$set: action.payload.userInfo.useSkin}});
            break;
        case Constants.HEADER_TOGGLE:
            let newStatus = update(state, {lastToggleStatus: {$set: action.toggleStatus}});
            switch (action.defaultToggleStatus) {
                case 'full':
                    switch (action.toggleStatus) {
                        case 'full':
                            return update(newStatus, {toggleStatus: {$set: 'mini'}});
                            break;
                        case 'mini':
                            return update(newStatus, {toggleStatus: {$set: 'full'}});
                            break;
                        case 'none':
                            return update(newStatus, {toggleStatus: {$set: 'full'}});
                            break;
                    }
                    break;
                case 'mini':
                    switch (action.toggleStatus) {
                        case 'full':
                            return update(newStatus, {toggleStatus: {$set: 'mini'}});
                            break;
                        case 'mini':
                            return update(newStatus, {toggleStatus: {$set: 'full'}});
                            break;
                        case 'none':
                            return update(newStatus, {toggleStatus: {$set: 'full'}});
                            break;
                    }
                    break;
                case 'none':
                    switch (action.toggleStatus) {
                        case 'full':
                            return update(newStatus, {toggleStatus: {$set: 'none'}});
                            break;
                        case 'mini':
                            return update(newStatus, {toggleStatus: {$set: 'full'}});
                            break;
                        case 'none':
                            return update(newStatus, {toggleStatus: {$set: 'full'}});
                            break;
                    }
                    break;
            }
            break;
        case Constants.APP_SCREEN_HEIGHT_LISTENNER:
            let newState = update(state, {
                windowHeight: {$set: action.height},
                windowWidth: {$set: action.width},
                lastToggleStatus: {$set: ''}
            });
            if (action.width <= 400) {
                return update(newState, {toggleStatus: {$set: 'none'}, defaultToggleStatus: {$set: 'none'}});
            } else if (400 < action.width && action.width <= 700) {
                return update(newState, {toggleStatus: {$set: 'mini'}, defaultToggleStatus: {$set: 'mini'}});
            } else {
                return update(newState, {toggleStatus: {$set: 'full'}, defaultToggleStatus: {$set: 'full'}});
            }
            break;
        case Constants.SIDE_BAR_MENU_ITEM_TOGGLE:
            if (!action.isNoView) {
                return update(state, {nowOnContentTarget: {$set: action.payload}});
            }
            break;
        case Constants.CONTAINER_TITTLE_MENU_SELECT_ACTIVE_CONTENT:
            return update(state, {nowOnContentTarget: {$set: action.payload.obj}});
            break;
        case Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT:
            if (action.payload === state.nowOnContentTarget) {
                return update(state, {nowOnContentTarget: {$set: null}});
            }
            break;
        case Constants.CONTAINER_TITTLE_MENU_CLOSE_ALL_ITEM:
            return update(state, {nowOnContentTarget: {$set: null}});
            break;
        case Constants.APP_FULL_SCREEN:
            return update(state, {isFullScreen: {$set: !state.isFullScreen}});
            break;
        case Constants.CONTENT_SETTING_CHANGE_SKIN:
            return update(state, {useSkin: {$set: action.payload}});
            break;
        case Constants.CONTENT_SETTING_CHANGE_MENU:
            if (state.nowOnContentTarget) {
                if (state.nowOnContentTarget.id === action.payload.id) {
                    return update(state, {nowOnContentTarget: {$set: action.payload}});
                }
            }
            break;
    }
    return state;
}
