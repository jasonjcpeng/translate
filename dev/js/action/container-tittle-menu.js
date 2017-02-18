import * as Constants from './CONSTANTS';


export const setLimitAndCursor = (limit,cursor)=>{

    return ({
        type:Constants.CONTAINER_TITTLE_MENU_SET_LIMIT_AND_CURSOR,
        limit:limit,
        cursor:cursor,
    });
}

export const scroll = e=>{
    return ({
        type: Constants.CONTAINER_TITTLE_MENU_SCROLL,
        payload:e
    });
}

export const selectActiveContent= e =>{
    return ({
        type:Constants.CONTAINER_TITTLE_MENU_SELECT_ACTIVE_CONTENT,
        payload:e
    });
}

export const deleteActiveContent = (k,nowOnContent)=>{
    return ({
        type:Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT,
        key:k,
        payload:nowOnContent
    });
}
export const closeOption = ()=>{
    return({
        type:Constants.CONTAINER_TITTLE_MENU_CLOSE_OPTION,
    });
}

export const closeAllItem = ()=>{
    return({
        type:Constants.CONTAINER_TITTLE_MENU_CLOSE_ALL_ITEM,
    });
}
export const closeOtherItem = (nowOnContent)=>{
    return({
        type:Constants.CONTAINER_TITTLE_MENU_CLOSE_OTHER_ITEM,
        payload:nowOnContent
    });
}
export const forkActiveItem = ()=>{
    return({
        type:Constants.CONTAINER_TITTLE_MENU_FORK_ACTIVE_ITEM,
    });
}

export const toggleFullScreen = ()=>{
    return({
        type:Constants.APP_FULL_SCREEN
    });
}