import * as Constants from './CONSTANTS';
import {isOnline} from '../config/config';
import {normalTableGetData} from '../services/api';


export const GetMount = (targetID)=>{
    return{
            type:Constants.NORMAL_TABLE_INIT,
            targetID:targetID,
    }
}

export const getData = (targetID,api,...arg)=>{

    return dispatch=>{
        normalTableGetData(api,...arg).then((data)=>{
            return dispatch({
                type:Constants.NORMAL_TABLE_GET_DATA,
                targetID:targetID,
                data:data
            })
        });
    };
}
