import * as Fetch from './fetch';
import {isOnline} from '../config/config';

//根据线上状态过滤API内容
const filterIsOnline = api=>{
    if(!isOnline){
        return (api+='.json');
    }
}
/*
* 整合包装异步获取数据的方法，最终返回一个Promise
* @param
* api:string api
* callBack:function 解析返回对象的回调函数，回调参数有(data,resolve,reject)
*           data:JSON 数据对象
*           resolve:Promise中的resolve
*           reject:Promise中的reject
* args:obj 请求参数
* method:HTTP method
* @return
* promise:Promise
* */
const createFetchPromise = (api,callBack,args='',method='GET')=>{
    return new Promise((resolve,reject)=>{
        Fetch.Fetch(filterIsOnline(api),args,method).then(
            res=>{
                if(res.state!==1){
                    reject(res.message);
                }else{
                    callBack(res.data,resolve,reject);
                }
            }
        ).catch(
            rej=>{
                reject(rej);
            }
        )
    });
}


const apis = {
    login:'api/User/logon',
    getInfo:'userInfo',
};

export const login = (userName,pwd)=>{
    let args = {
        UserName:userName,
        Pwd:pwd
    }
    return createFetchPromise(apis.login,(data,resolve,reject)=>{
        resolve(data);
    },args,'POST');
}


export const appStart =()=>{
    return new Promise((resolve,reject)=>{
       Fetch.Fetch(filterIsOnline(apis.getInfo)).then(res=>{
            let userInfo = {
                userID:res.userInfo.userID,
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
    return createFetchPromise(api,(data,resolve,reject)=>{
            resolve(data);
    })
}
