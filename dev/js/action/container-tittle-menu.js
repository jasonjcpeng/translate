import * as Constants from './CONSTANTS';


export const defaultScrollX = e=>{
    return ({
        type: Constants.CONTAINER_TITTLE_MENU_SET_DEFAULT_SCROLL_X,
        payload:e
    });

}

export const scroll = e=>{
    return ({
        type: Constants.CONTAINER_TITTLE_MENU_SCROLL,
        payload:e
    });
}
