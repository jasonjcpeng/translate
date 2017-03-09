import userInfo from '../../jsons/apiData/userInfo.json';
import * as Fetch from './fetch';
import {isOnline} from '../config/config';

const api = isOnline?{
    getUser:''
}:{
    getUser:'./jsons/apiData/userInfo.json'
}


export const appStart =()=>{
    return new Promise((resolve,reject)=>{
       Fetch.Fetch(api.getUser).then(res=>{
            let userInfo = {
                name:res.userInfo.name,
                power:res.userInfo.power,
                imgUrl:res.userInfo.imgUrl,
                useSkin:res.userInfo.useSkin
            }
            let menu = res.menu.map(v=>{
                return {
                    icon: v.icon,
                    id: v.id,
                    code: v.code,
                    parentCode: v.parentCode,
                    menuName: v.menuName,
                    createTime:v.createtime,
                    menuSort:v.menuSort,
                    isEnable:v.isEnable,
                    api:v.url
                }
            });
            resolve({
                userInfo:userInfo,
                menu:menu
            });

        }).catch(rej=>{
            reject(rej);
        });
    });
}
