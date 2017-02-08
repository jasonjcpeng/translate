import userInfo from '../../jsons/userInfo.json';
import * as Ajax from './ajax';

const api = {
    getMenu:'./jsons/menu.json',
    getUser:'./jsons/userInfo.json'
}

export const appStart =()=>{
   return Promise.all([Ajax.AjaxGet(api.getUser),Ajax.AjaxGet(api.getMenu)]);
}
