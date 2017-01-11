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

export const deleteActiveContent = k=>{
    return ({
        type:Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT,
        key:k
    });
}