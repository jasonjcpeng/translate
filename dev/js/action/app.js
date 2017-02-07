import * as Constants from './CONSTANTS';
import {appStart} from '../services/api';

export const screenHeightListenner = (height,width)=>{
    return ({
        type:Constants.APP_SCREEN_HEIGHT_LISTENNER,
        height:height,
        width:width
    });
}
export const AppDidMount = ()=>{
    return dispatch=>{

    }
}
