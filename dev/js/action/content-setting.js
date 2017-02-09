import * as Constants from './CONSTANTS';

export const count=e=>{
    return ({
        type:'COUNT',
        payload:++e
    })
}