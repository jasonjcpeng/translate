import fetch from 'isomorphic-fetch';
import {Host,TimeOut} from '../config/config';

export const Get = (url,args)=>{
    let Url = Host+url;
    return new Promise((resolve,reject)=>{
        let timer = setTimeout(()=>{
            console.log('Timing Out!');
            reject(2333);
        },TimeOut);
        fetch(Url).then(res=>{
            clearTimeout(timer);
            if(res.status>400){
                console.log(Url+':'+res.status);
                reject(res.status);
            }else{
                res.text().then(data=>{
                    console.log(Url+':Done!');
                    resolve(JSON.parse(data));
                })
            }
        })
    });

}
