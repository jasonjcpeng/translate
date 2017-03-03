import qs from 'qs';
import fetch from 'isomorphic-fetch';
import {Host, TimeOut} from '../config/config';

export const Fetch = (url,args,method='GET')=> {
    let Url = Host + url;
    const opts = {method: method.toUpperCase(), body: qs.stringify(args)}
    const headers = {
        'mode': 'no-cors',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
    if (opts.method === 'GET') {
        Url = Url + '?' + opts.body
        delete opts.body
        headers['Content-Type'] = 'application/json'
    }
    opts.headers = headers
    return new Promise((resolve, reject)=> {
        let timer = setTimeout(()=> {
            console.log('Timing Out!');
            reject(2333);
        }, TimeOut);
        fetch(Url, opts).then(res=> {
            clearTimeout(timer);
            if (res.status > 400) {
                console.log(Url + ':' + res.status);
                reject(res.status);
            } else {
                res.text().then(data=> {
                    console.log(Url + ':Done!');
                    resolve(JSON.parse(data));
                })
            }
        })
    });

}
