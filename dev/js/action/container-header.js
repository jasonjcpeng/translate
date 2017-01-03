import * as Constants from './CONSTANTS';
export const toggle = (defaultToggleStatus,toggleStatus)=>{
    return ({
        type:Constants.CONTAINER_HEADER_TOGGLE,
        defaultToggleStatus:defaultToggleStatus,
        toggleStatus:toggleStatus
    });
}
