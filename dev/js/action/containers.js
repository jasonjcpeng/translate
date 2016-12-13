import * as Constants from './constants';
export const AppDidMount = ()=>{
    let e = {
        title:'App',
        content:'Hello World!'
    }
    return dispatch=>{
        dispatch({
            type:Constants.INIT_CONTAINER_APP_DID_MOUNT,
            payload:e
        });
    }
}

