import qs from 'qs';
import fetch from 'isomorphic-fetch';
import {Location,Host, TimeOut,isOnline} from '../config/config';

export const Fetch = (url,args,method='GET')=> {
    let Url = (isOnline?Host:Location) + url;
    let localMethod = isOnline?method:'GET';
    const opts = {method: localMethod.toUpperCase(),credentials: "include",body:qs.stringify(args)}
    const headers = {
        'mode': 'cors',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
    if (opts.method === 'GET') {
        Url = Url + '?' + opts.body;
        delete opts.body;
        headers['Content-Type'] = 'application/json'
    }
    opts.headers = headers;
    return new Promise((resolve, reject)=> {
        let timer = setTimeout(()=> {
            console.log(Url+':Timing Out!');
            reject('连接超时！');
        }, TimeOut);
        fetch(Url, opts).then(res=> {
            clearTimeout(timer);
            if (res.status > 400) {
                console.log(Url + ':' + res.status);
                reject(res.status);
            } else {
                res.json().then(data=> {
                    console.log(Url + ':Done!');
                        resolve(data);
                })
            }
        }).catch(rej=>{
            console.log('fetch message:'+rej);
            reject(rej+'\n请联系管理员！');
        })
    });

}


