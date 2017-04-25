//全屏
export const fullScreen = (el)=>{
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
            wscript;

        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
            return;
        }

        if(typeof window.ActiveXObject != "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if(wscript) {
                wscript.SendKeys("{F11}");
            }
        }
}
//退出全屏
export const exitFullScreen = ()=>{
        var el= document,
            cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
            wscript;

        if (typeof cfs != "undefined" && cfs) {
            cfs.call(el);
            return;
        }

        if (typeof window.ActiveXObject != "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
            }
        }
}

export const IsPC= ()=>{
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}

export const IsObjEmpty = (obj)=>{
    for(let i in obj){
        return false
    }
    return true;
}

export const getNowFormatDate=()=>{
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + "T" + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

export const stringifyArrWhosChildIsObj = (viewPoint)=>{
    let viewPointArr = [];
    for(let i in viewPoint){
        viewPointArr.push(JSON.stringify(viewPoint[i]));
    }
    return viewPointArr.join('@#');
}

//这里如果来的数据不是JSON的string会报错
export const arraifyStringWhosChildIsObj = (viewPointString)=>{
    let viewPointArr = [];
    let result = [];
    if(viewPointString){
        viewPointArr = viewPointString.split('@#');
        if(viewPointArr.length>0){
            result = viewPointArr.map(v=>{
                if(v.indexOf('{')>=0){
                    return (JSON.parse(v));
                }else{
                    return '';
                }
            });
        }
    }
    return result
}