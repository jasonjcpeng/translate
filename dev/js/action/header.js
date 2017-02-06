import * as Constants from './CONSTANTS';
export const toggle = (defaultToggleStatus,toggleStatus)=>{
    return ({
        type:Constants.HEADER_TOGGLE,
        defaultToggleStatus:defaultToggleStatus,
        toggleStatus:toggleStatus
    });
}

