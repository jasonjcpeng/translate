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
    let finalArgs = args;
    if(!isOnline){
        finalArgs = '';
    }
    return new Promise((resolve, reject)=> {
        Fetch.Fetch(filterIsOnline(api), finalArgs, method).then(
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
    login: 'User/logon',
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
            });
        }
        resolve(formatData);
    })
}

export const normalTableGetData = (api,...args)=>{
    /*page	第几页	number	@mock=0
     records	总条数	number	@mock=0
     rows	每页显示多少行	number	@mock=0
     sidx	排序字段1	string	@mock=string
     sord	asc升序 desc倒序	string	@mock=string
     total*/
    let finalArgs = {
        page:args[0]?args[0]:'',
        records:args[1]?args[1]:'',
        rows:args[2]?args[2]:'',
        sidx:args[3]?args[3]:'',
        sord:args[4]?args[4]:'',
        total:args[5]?args[5]:''
    }
    return createFetchPromise(api,(data, resolve, reject)=>{
        resolve(data);
    },finalArgs)
}
