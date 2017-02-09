import userInfo from '../../jsons/userInfo.json';
import * as Ajax from './ajax';

const api = {
    getMenu:'./jsons/menu.json',
    getUser:'./jsons/userInfo.json'
}

export const appStart =()=>{
    return new Promise((resolve,reject)=>{
        Promise.all([Ajax.Get(api.getUser),Ajax.Get(api.getMenu)]).then(res=>{
            let [resUserInfo,resMenu] = res;
            let userInfo = {
                name:resUserInfo.userInfo.name,
                power:resUserInfo.userInfo.power,
                imgUrl:resUserInfo.userInfo.imgUrl,
                useSkin:resUserInfo.userInfo.useSkin
            }
            let menu = resMenu.menu.map(v=>{
                return {
                    icon: v.icon,
                    id: v.id,
                    code: v.code,
                    parentCode: v.parentCode,
                    menuName: v.menuName,
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
