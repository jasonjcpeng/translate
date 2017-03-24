import userInfo from '../../jsons/apiData/userInfo.json';
import * as Fetch from './fetch';
import {isOnline} from '../config/config';

//根据线上状态过滤API内容
const filterIsOnline = api=>{
    if(!isOnline){
        return (api+='.json');
    }
}

const apis = {
    getInfo:'userInfo',
};



export const appStart =()=>{
    return new Promise((resolve,reject)=>{
       Fetch.Fetch(filterIsOnline(apis.getInfo)).then(res=>{
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
                    api:v.url,
                    viewPoint:v.viewPoint
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

export const menuSettingOptionMenuFetchViewPointConfig = (api)=>{
    return new Promise((resolve,reject)=>{
        Fetch.Fetch(filterIsOnline(api)).then(
                res=>{
                    if(res.state!=="1"){
                        reject(res.message);
                    }else{
                        resolve(res.data);
                    }
                }
        ).catch(
                rej=>{
                    reject(rej);
                }
        )
    });
}
