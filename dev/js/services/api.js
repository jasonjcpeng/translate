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
                    if (Number.parseInt(res.state) !== 1) {
                        if(res.message){
                            reject(res.message);
                        }
                    } else {
                        callBack(res.data, resolve, reject);
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


const apis = {
    login: 'api/Login/Login',
    getMenu: 'api/Module/GetMenu',
    insertMenu:'/api/Module/Post',
    getUserInfo: '/api/User/GetUser',
    getRole:'/api/Role/Get/',
    getCols:'/api/Module/GetCols'
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
                if(res[1].state===1){
                    Fetch.Fetch(filterIsOnline(apis.getRole+'/'+res[1].data['AX_RoleId'])).then(getRoleResult=>{
                        if(getRoleResult.state===1){
                            let userInfo = {
                                name: res[1].data['AX_RealName'],
                                power: getRoleResult.data['AX_FullName'],
                                powerEnCode:getRoleResult.data['AX_EnCode'],
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
                                        viewPoint:arraifyStringWhosChildIsObj(v['AX_ViewPoint']),
                                        btnGroup:arraifyStringWhosChildIsObj(v['AX_BtnGroup']),
                                        modifyViewPoint:arraifyStringWhosChildIsObj(v['AX_ModifyViewPoint'])
                                    }
                                    menu.push(item);
                                }
                            }
                            resolve({
                                userInfo: userInfo,
                                menu: menu
                            });
                        }else{
                            reject(getRoleResult.message)
                        }
                    }).catch(getRoleRej=>{
                        reject(getRoleRej)
                    })
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
            formatData.push({
                name:data[i],
                isEnable: true,
                CNName: '',
                width: 0,
            });
        }
        resolve(formatData);
    }, arg);
}
//表格获取数据
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
    if(isOnline){
        api +="?key='"+Key+"'&value='"+Val+"'";
    }
    return createFetchPromise(api,(data, resolve, reject)=>{
        let resultData = {
            tableData:data['UserList']?data['UserList']:[],
            tablePagination:data['Pagination']?data['Pagination']:{}
        }
        resolve(resultData);
    },finalArgs,'POST')
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
    api+=''+item['AX_Id'];
    return createFetchPromise(api,(resData,resolve,reject)=>{
        resolve(resData);
    },item,'PUT');
}
//删除菜单内容中的内容项
export const apiDeleteTableItem = (api,data)=>{
    let arr =[];
    if(Object.prototype.toString.call(data)==='[object Array]'){

    }else{
        arr.push(data['AX_Id']);
    }
    return createFetchPromise(api,(resData,resolve,reject)=>{
        resolve(resData);
    },arr,'DELETE');
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
//操作表格中开关式按钮
export const apiOnClickToggleOptions = (api,item)=>{
    api+= item['AX_Id'];
    return createFetchPromise(api, (data, resolve, reject)=> {
        resolve(data);
    },'');
}
