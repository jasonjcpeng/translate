import * as Fetch from './fetch';
import {isOnline} from '../config/config';
import {stringifyArrWhosChildIsObj,arraifyStringWhosChildIsObj} from '../config/tools';
import Md5 from 'md5';


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
                if(res){
                    if (Number.parseInt(res.state) === 1) {
                        callBack(res.data, resolve, reject);
                    }else{
                        if(res.message){
                            reject(res.message);
                        }
                    }
                }else{
                    reject("来自API返回值的错误！请联系管理员");
                }
            }
        ).catch(
            rej=> {
                reject(rej);
            }
        )
    });
}

const filterStringDataDontBeNull = (data)=> {
    return data === null ? '' : data;
}

const apis = {
    login: 'api/Login/Login',
    getMenu: 'api/Module/GetMenu',
    insertMenu:'/api/Module/Post',
    modifyMenu:'/api/Module/Put/',
    deleteMenu:'/api/Module/Delete',
    getUserInfo: '/api/User/GetUser',
    getRole:'/api/Role/Get/',
    getOrganize: '/api/Organize/GetOrganize/',
    getCols:'/api/Module/GetCols',
    changeUserInfo:'/api/User/Put/',
    resetPassWord: '/api/Account/RevisePassword',
    getModuleByRoleID: '/api/RoleAuthorize/GetAuthByRoleId',
    getDataBabel:'/api/Data/Get',
    getDataBabelDetail:'/api/Data/GetDetail'
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

//集成获取该用户菜单，该用户个人信息，该用户个人权限信息
export const appStart = ()=> {
    return new Promise((resolve, reject)=> {
        Promise.all([Fetch.Fetch(filterIsOnline(apis.getMenu)),Fetch.Fetch(filterIsOnline(apis.getUserInfo))]).then(
            res=> {
                if(res[1].state===1&&res[1].data!==null){
                    //arr[0]AX_RoleId角色信息
                    Promise.all([createFetchPromise(apis.getRole + '/' + res[1].data['AX_RoleId'], (data, res, rej)=> {
                        res(data)
                    }),//arr[1]AX_DepartmentId部门信息
                        createFetchPromise(apis.getOrganize + '/' + res[1].data['AX_OrganizeId'], (data, res, rej)=> {
                            res(data)
                        }),
                        //arr[2]数据字典信息
                        createFetchPromise(apis.getDataBabel, (data, res, rej)=> {
                            res(data)
                        })
                    ])
                        .then(getAllDetail=> {
                            let userInfo = {
                                id:res[1].data['AX_Id'],
                                account:filterStringDataDontBeNull(res[1].data['AX_Account']),
                                name: filterStringDataDontBeNull(res[1].data['AX_RealName']),
                                powerId: filterStringDataDontBeNull(res[1].data['AX_RoleId"']),
                                power: filterStringDataDontBeNull(getAllDetail[0]['AX_FullName']),
                                powerEnCode: filterStringDataDontBeNull(getAllDetail[0]['AX_EnCode']),
                                imgUrl: res[1].data['AX_HeadIcon']?res[1].data['AX_HeadIcon']:'./img/profile_small.jpg',
                                useSkin: res[1].data['Theme']?res[1].data['Theme']:'skin-1',
                                quickButton:arraifyStringWhosChildIsObj(res[1].data['Shortcutbutton']),
                                nickName: filterStringDataDontBeNull(res[1].data['AX_NickName']),
                                birthDay: filterStringDataDontBeNull(res[1].data['AX_Birthday']),
                                mobilePhone: filterStringDataDontBeNull(res[1].data['AX_MobilePhone']),
                                eMail: filterStringDataDontBeNull(res[1].data['AX_Email']),
                                /*  departmentId: res[1].data['AX_DepartmentId'],
                                 department: '部门',*/
                                organizeId: filterStringDataDontBeNull(res[1].data['AX_OrganizeId']),
                                organize: filterStringDataDontBeNull(getAllDetail[1]['AX_FullName']),
                                isAdministrator: filterStringDataDontBeNull(res[1].data['AX_IsAdministrator']),
                                description: filterStringDataDontBeNull(res[1].data['AX_Description']),
                                createTime: filterStringDataDontBeNull(res[1].data['AX_CreatorTime']),
                            }
                            let dataBabel = getAllDetail[2];
                            let formatDataBabel = dataBabel.map(v=>{
                                let Obj = {};
                                for(let i in v){
                                    if(i==='AX_Id'){
                                        Obj['id']=v[i];
                                        Obj['code']=v[i];
                                    }else if(i==='AX_ParentId'){
                                        Obj['parentCode']=v[i];
                                    }else if(i==='AX_EnCode'){
                                        Obj['encode']=v[i];
                                    }else if(i==='AX_FullName'){
                                        Obj['name']=v[i];
                                    }else{
                                        Obj[i] = v[i];
                                    }
                                }
                                return Obj;
                            });
                            let menu = [];
                            if(res[0].state===1&&res[0].data!==null){
                                for(let i in res[0].data){
                                    let v= res[0].data[i];
                                    if(v){
                                        let item = {
                                            icon: v['AX_Icon']?v['AX_Icon']:'',
                                            id: v['AX_Id']?v['AX_Id']:'',
                                            code: v['AX_Id']?v['AX_Id']:'',
                                            parentCode:v['AX_ParentId']?v['AX_ParentId']:undefined,
                                            menuName:v['AX_FullName']?v['AX_FullName']:'',
                                            createTime:v['AX_CreatorTime']?v['AX_CreatorTime']:'',
                                            menuSort: v['AX_SortCode']?v['AX_SortCode']:0,
                                            isEnable: true,
                                            api: v['AX_UrlAddress']?v['AX_UrlAddress']:'',
                                            viewPoint:arraifyStringWhosChildIsObj(v['AX_ViewPoint']),
                                            btnGroup:arraifyStringWhosChildIsObj(v['AX_BtnGroup']),
                                            modifyViewPoint:arraifyStringWhosChildIsObj(v['AX_ModifyViewPoint'])
                                        }
                                        menu.push(item);
                                    }
                                }
                            }else{
                                reject("来自‘"+apis.getMenu+"’的消息："+res[0].message);
                            }
                            resolve({
                                userInfo: userInfo,
                                menu: menu,
                                babelData:formatDataBabel
                            });
                    }).catch(getRoleRej=>{
                        reject(getRoleRej)
                    })
                }else{
                    reject("来自‘"+apis.getUserInfo+"’的消息："+res[1].message);
                }
            }
        ).catch(
            rej=> {
                reject(rej);
            }
        );
    });
}
//根据菜单视图项API获取菜单表头字段
export const menuSettingOptionMenuFetchViewPointConfig = (args)=> {
    let arg = {
        ModName:args
    }
    return createFetchPromise(apis.getCols, (data, resolve, reject)=>{
        let formatData = [];
        for (let i in data) {
            if(data[i]!=='AX_Id'&&data[i]!=='AX_ParentId'&&data[i]!=='Id'){
                formatData.push({
                    name:data[i],
                    isEnable: true,
                    CNName: '',
                    width: 0,
                });
            }
        }
        resolve(formatData);
    }, arg);
}
//表格获取数据
export const normalTableGetData = (api,args)=>{
    if(!isOnline){
        api = api.substring(0,api.lastIndexOf('/'));
    }
    /* "rows": 10,
     "page": 1,
     "sidx": "Id",
     "sord": "ASC",
     "records": 51,
     "total": 6,
     "LastId": "66",
     "dic": [],
     "dateList": []*/
    return createFetchPromise(api,(data, resolve, reject)=>{
        let resultData = {
            tableData:data['DataList']?data['DataList']:[],
            tablePagination:data['Pagination']? {
                rows: data['Pagination'].rows,
                page: data['Pagination'].page,
                sidx: data['Pagination'].sidx,
                sord: data['Pagination'].sord,
                records: data['Pagination'].records,
                total: data['Pagination'].total,
                LastId: data['Pagination'].LastId,
                dic: data['Pagination'].dic,
                dateList: data['Pagination'].dateList,
            }:{}
        }
        resolve(resultData);
    },args,'POST')
}
//增加菜单内容中的内容项
export const insertTableItem = (api,item,data)=>{
    let newData = data;
    if(item){
        newData['AX_ParentId'] = item['AX_Id'];
    }else{
        newData['AX_ParentId'] = '0';
    }

    return createFetchPromise(api,(data,resolve, reject)=>{
        resolve(data);
    },newData,'POST')
}
//修改菜单内容中的内容项
export const apiModifyTableItem = (api,item)=>{
    return createFetchPromise((api+''+item['AX_Id']),(resData,resolve,reject)=>{
        resolve(resData);
    },item,'PUT');
}
//删除菜单内容中的内容项
export const apiDeleteTableItem = (api,data)=>{
    let arr =[];
    if(Object.prototype.toString.call(data)==='[object Array]'){
        data.map(v=>{
            arr.push(v['AX_Id']);
        });
    }else{
        arr.push(data['AX_Id']);
    }
    return createFetchPromise(api,(resData,resolve,reject)=>{
        resolve(resData);
    },arr,'DELETE');
}

//修改菜单
export const modifyTableMenu = menu=>{
    let arg = {
        AX_Id:menu.id,
        AX_ParentId: menu.parentCode,
        AX_FullName: menu.menuName,
        AX_Icon: menu.icon,
        AX_UrlAddress: menu.api,
        AX_SortCode: menu.menuSort,
        AX_CreatorTime: menu.createTime,
        AX_ViewPoint: stringifyArrWhosChildIsObj(menu.viewPoint),
        AX_BtnGroup: stringifyArrWhosChildIsObj(menu.btnGroup),
        AX_ModifyViewPoint:stringifyArrWhosChildIsObj(menu.modifyViewPoint)
    }
    return createFetchPromise(apis.modifyMenu+=menu.id, (data, resolve, reject)=> {
        resolve(data);
    },arg,'PUT');
}
//增加菜单
export const insertTableMenu = (menu)=>{
    let arg = {
        AX_ParentId: menu.parentCode,
        AX_FullName: menu.menuName,
        AX_Icon: menu.icon,
        AX_UrlAddress: menu.api,
        AX_SortCode: menu.menuSort,
        AX_CreatorTime: menu.createTime,
        AX_ViewPoint: stringifyArrWhosChildIsObj(menu.viewPoint),
        AX_BtnGroup: stringifyArrWhosChildIsObj(menu.btnGroup),
        AX_ModifyViewPoint:stringifyArrWhosChildIsObj(menu.modifyViewPoint)
    }

    return createFetchPromise(apis.insertMenu, (data, resolve, reject)=> {
        resolve(data);
    },arg,'POST');
}
//删除菜单
export const apiDeleteMenu = (item)=>{
    let arg = [item.id]
    return createFetchPromise(apis.deleteMenu,(data, resolve, reject)=> {
        resolve(data);
    },arg,'DELETE');
}

//操作表格中开关式按钮
export const apiOnClickToggleOptions = (api,item)=>{
    return createFetchPromise((api+item['AX_Id']), (data, resolve, reject)=> {
        resolve(data);
    },'');
}

//修改用户信息
export const apiChangeUserInfo = (id,arg)=>{
    let finalArg = {
        AX_Id:id,
        AX_RealName:arg.name,
        AX_Birthday:arg.birthDay,
        AX_NickName:arg.nickName,
        Shortcutbutton:arg.quickButton?stringifyArrWhosChildIsObj(arg.quickButton):undefined,
        Theme:arg.useSkin
    }
    return createFetchPromise(apis.changeUserInfo+id, (data, resolve, reject)=> {
        resolve(data);
    },finalArg,'PUT');
}
//修改用户密码
export const apiResetPassWord = (account,data)=>{
    let finalArg = {
        UserName: account,
        Pwd: Md5(data.oldPassWord)
    }
    return createFetchPromise(apis.resetPassWord+'?newPwd='+Md5(data.newPassWord), (data, resolve, reject)=> {
        resolve(data);
    },finalArg,'POST');
}
//权限分配
export const apiSetRoleAuthorize = (api,roles,modules)=>{
    let roleID =[];
    let moduleID = [];
    roleID.push(roles['AX_Id']);
    modules.map((v,k)=>{
        moduleID.push(v.id);
    });
    let finalArg = {
        ModuleIds: moduleID,
        RoleId: roleID
    }

    return createFetchPromise(api, (data, resolve, reject)=> {
        resolve(data);
    },finalArg,'POST');
}
//根据当前角色ID获取当前角色所拥有的菜单项
export const apiGetModuleByRoleID = (Role)=> {
    let api = apis.getModuleByRoleID + '?roleId=' + Role['AX_Id'];
    return createFetchPromise(api, (data, resolve, reject)=> {
        let formatData =[];
        if(data){
            formatData = data.map((v, k)=> {
                return {
                    id: v['AX_id'],
                    code: v['AX_id'],
                    parentCode:v['AX_Parentid'],
                    name:v['AX_FullName']
                }
            });
        }
        resolve(formatData);
    }, '', 'POST');
}
//根据当前数据字典ID获取具体数据
export const apiGetDataBabelDetail = (item)=>{
    let arg = {
        encode:item.encode
    }
    return createFetchPromise(apis.getDataBabelDetail, (data, resolve, reject)=> {
        let formatData =[];
        if(data){
            formatData = data.map(v=>{
                let Obj = {};
                for(let i in v){
                    if(i==='AX_ItemCode'){
                        Obj['encode']=v[i];
                    }else if(i==='AX_ItemName'){
                        Obj['name']=v[i];
                    }else{
                        Obj[i] = v[i];
                    }
                }
                return Obj;
            });
        }
        resolve(formatData);
    }, arg, 'GET');
}