import * as Fetch from './fetch';
import {isOnline} from '../config/config';
import Md5 from 'md5';

//测试数据待删除
import configApi from '../../jsons/apiData/api/configApi.json';

//根据线上状态过滤API内容
const filterIsOnline = api=> {
    if (!isOnline) {
        return (api += '.json');
    }else{
        return api;
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
    login: 'api/Login/Login',
    getMenu: 'api/Module/GetMenu',
    insertMenu:'/api/Module/Post',
    getUserInfo: 'userInfo'
};

export const login = (userName, pwd)=> {
    let args = {
        UserName:userName,
        Pwd:Md5(pwd)
    }
    return createFetchPromise(apis.login, (data, resolve, reject)=> {
        resolve(data);
    }, args, 'POST');
}


export const appStart = ()=> {
    return new Promise((resolve, reject)=> {
        Promise.all([Fetch.Fetch(filterIsOnline(apis.getMenu))/*Fetch.Fetch(filterIsOnline(apis.getUserInfo))*/]).then(
            res=> {
                let userInfo = {
                    name: '1',
                    power: '2',
                    imgUrl: './img/profile_small.jpg',
                    useSkin: 'skin-1'
                }
                let menu = [];
                for(let i in res[0].data){
                    let v= res[0].data[i];
                    if(v){
                        let item = {
                            icon: v['AX_Icon'],
                            id: v['AX_Id'],
                            code: v['AX_Id'],
                            parentCode:v['AX_ParentId'],
                            menuName:v['AX_FullName'],
                            createTime:v['AX_CreatorTime'],
                            menuSort: v['AX_SortCode'],
                            isEnable: true,
                            api: v['AX_UrlAddress'],
                            viewPoint:v['AX_ViewPoint'],
                            btnGroup:v['AX_BtnGroup'],
                            modifyViewPoint:v['AX_ModifyViewPoint']
                        }
                        menu.push(item);
                    }
                }

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
    return new Promise((resolve,reject)=>{
        let formatData = [];
        for (let i in configApi.data) {
            formatData.push({
                name:i,
                isEnable: true,
                CNName: '',
                width: 0,
            });
        }
        resolve(formatData);
    });
    /*return createFetchPromise(api, (data, resolve, reject)=> {
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
    })*/
}

export const normalTableGetData = (api,args,searchKey,searchVal)=>{
    /*page	第几页	number	@mock=0
     records	总条数	number	@mock=0
     rows	每页显示多少行	number	@mock=0
     sidx	排序字段1	string	@mock=string
     sord	asc升序 desc倒序	string	@mock=string
     total*/
    let Key = '';
    let Val = '';
    let finalArgs = {
        page:'',
        rows:'',
        sidx:'',
        sord:'',
        total:'',
        records:''
    }
    for(let i in finalArgs){
        args[i]?finalArgs[i]=args[i]:finalArgs[i]='';
    }

    if(searchKey){
        Key = searchKey;
        Val = searchVal;
    }
    api +="?key='"+Key+"'&value='"+Val+"'";
    return createFetchPromise(api,(data, resolve, reject)=>{
        resolve(data);
    },finalArgs,'POST')
}

export const insertTableMenu = (menu)=>{
    let arg = {
        MouduleID: 0,
        AX_Id: '',
        AX_ParentId: menu.parentCode,
        AX_Layers: 0,
        AX_EnCode: '',
        AX_FullName: menu.menuName,
        AX_Icon: menu.icon,
        AX_UrlAddress: menu.api,
        AX_Target: '',
        AX_IsMenu: true,
        AX_IsExpand: true,
        AX_IsPublic: true,
        AX_AllowEdit: true,
        AX_AllowDelete: true,
        AX_SortCode: menu.menuSort,
        AX_DeleteMark: true,
        AX_EnabledMark: true,
        AX_Description: '',
        AX_CreatorTime: menu.createTime,
        AX_CreatorUserId: '',
        AX_LastModifyTime: '',
        AX_LastModifyUserId: '',
        AX_DeleteTime: '',
        AX_DeleteUserId: '',
        AX_ViewPoint: menu.viewPoint,
        AX_BtnGroup: menu.btnGroup,
        AX_ModifyViewPoint: menu.modifyViewPoint
    }
    return createFetchPromise(apis.insertMenu, (data, resolve, reject)=> {
        resolve(data);
    },arg,'POST');
}
