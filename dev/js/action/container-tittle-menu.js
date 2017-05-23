import * as Constants from './CONSTANTS';

//设定sidebar高度的限定
export const setLimitAndCursor = (limit,cursor)=>{
    return ({
        type:Constants.CONTAINER_TITTLE_MENU_SET_LIMIT_AND_CURSOR,
        limit:limit,
        cursor:cursor,
    });
}
//sidebar 滚动监听
export const scroll = e=>{
    return ({
        type: Constants.CONTAINER_TITTLE_MENU_SCROLL,
        payload:e
    });
}
//选定为当前活跃的页面内容选项卡
export const selectActiveContent= e =>{
    return ({
        type:Constants.CONTAINER_TITTLE_MENU_SELECT_ACTIVE_CONTENT,
        payload:e
    });
}
//删除指定的当前活跃的页面内容选项卡
export const deleteActiveContent = (k,nowOnContent)=>{
    return ({
        type:Constants.CONTAINER_TITTLE_MENU_DELETE_ACTIVE_CONTENT,
        key:k,
        payload:nowOnContent
    });
}
//关闭选项卡
export const closeOption = ()=>{
    return({
        type:Constants.CONTAINER_TITTLE_MENU_CLOSE_OPTION,
    });
}
//关闭所有全部选项卡
export const closeAllItem = ()=>{
    return({
        type:Constants.CONTAINER_TITTLE_MENU_CLOSE_ALL_ITEM,
    });
}
//关闭其他选项卡
export const closeOtherItem = (nowOnContent)=>{
    return({
        type:Constants.CONTAINER_TITTLE_MENU_CLOSE_OTHER_ITEM,
        payload:nowOnContent
    });
}
//定位当前选项卡
export const forkActiveItem = ()=>{
    return({
        type:Constants.CONTAINER_TITTLE_MENU_FORK_ACTIVE_ITEM,
    });
}
//全屏模式开关Action
export const toggleFullScreen = ()=>{
    return({
        type:Constants.APP_FULL_SCREEN
    });
}