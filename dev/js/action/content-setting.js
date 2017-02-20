import * as Constants from './CONSTANTS';

export const contentSettingGetMount=(target)=>{
    return ({
        type:Constants.CONTENT_SETTING_INIT,
        target:target
    });
}


export const actionCount=e=>{
    return ({
        type:'COUNT',
        payload:++e
    })
}