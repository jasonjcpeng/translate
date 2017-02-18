import * as Constants from './CONSTANTS';

export const contentSettingGetMount=(target)=>{
    return ({
        type:'CONTENT_SETTING_INIT',
        target:target
    });
}


export const actionCount=e=>{
    return ({
        type:'COUNT',
        payload:++e
    })
}