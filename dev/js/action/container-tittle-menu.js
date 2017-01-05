import * as Constants from './CONSTANTS';

export const scroll = e=>{
    console.log(e);
    return ({
        type: Constants,
        payload:e
    });
}
