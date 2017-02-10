import * as Constants from './CONSTANTS';

export const actionCount=e=>{
    return ({
        type:'COUNT',
        payload:++e
    })
}