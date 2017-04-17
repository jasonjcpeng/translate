import * as Fetch from './fetch';
import {isOnline} from '../config/config';

//根据线上状态过滤API内容
const filterIsOnline = api=> {
    if (!isOnline) {
        return (api += '.json');
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
const createFetchPromise = (api, callBack, args = '', method = 'GET')=> {
    return new Promise((resolve, reject)=> {
        Fetch.Fetch(filterIsOnline(api), args, method).then(
            res=> {
                if (Number.parseInt(res.state) !== 1) {
                    reject(res.message);
                } else {
                    callBack(res.data, resolve, reject);
                }
            }
        ).catch(
            rej=> {
                reject(rej);
            }
        )
    });
}


const apis = {
    login: 'api/User/logon',
    getMenu: 'api/module',
    getUserInfo: 'userInfo'
};

export const login = (userName, pwd)=> {
    let args = {
        UserName: userName,
        Pwd: pwd
    }
    return createFetchPromise(apis.login, (data, resolve, reject)=> {
        resolve(data);
    }, args, 'POST');
}


export const appStart = ()=> {
    return new Promise((resolve, reject)=> {
        Promise.all([Fetch.Fetch(filterIsOnline(apis.getMenu)), Fetch.Fetch(filterIsOnline(apis.getUserInfo))]).then(
            res=> {
                let userInfo = {
                    name: res[1].userInfo.name,
                    power: res[1].userInfo.power,
                    imgUrl: res[1].userInfo.imgUrl,
                    useSkin: res[1].userInfo.useSkin
                }
                let menu = res[0].data.map(v=> {
                    return {
                        icon: v.AX_Icon,
                        id: v.AX_Id,
                        code: v.AX_Id,
                        parentCode: v.AX_ParentId,
                        menuName: v.AX_FullName,
                        createTime: v.AX_CreatorTime,
                        menuSort: v.AX_SortCode,
                        isEnable: v.AX_EnabledMark,
                        api: v.AX_UrlAddress,
                    }
                });
                resolve({
                    userInfo: userInfo,
                    menu: menu
                });
            }
        ).catch(
            rej=> {
                reject(rej);
            }
        );
    });
}

export const menuSettingOptionMenuFetchViewPointConfig = (api)=> {
    return createFetchPromise(api, (data, resolve, reject)=> {
        let formatData = [];
        for (let i in data) {
            formatData.push({
                name:i,
                isEnable: true,
                CNName: '',
                width: 0,
                remark:data[i]
            });
        }
        resolve(formatData);
    })
}
