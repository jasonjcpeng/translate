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
//获取格式化后的时间数据
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
//把要传递出去的Object类型转换成String
export const stringifyArrWhosChildIsObj = (viewPoint)=>{
    let viewPointArr = [];
    for(let i in viewPoint){
        viewPointArr.push(JSON.stringify(viewPoint[i]));
    }
    return viewPointArr.join('@#');
}

//将从API中获取的String类型转换成Object,这里如果来的数据不是JSON的string会报错
export const arraifyStringWhosChildIsObj = (viewPointString)=> {
    let viewPointArr = [];
    let result = [];
    if (viewPointString) {
        viewPointArr = viewPointString.split('@#');
        if (viewPointArr.length > 0) {
            result = viewPointArr.map(v=> {
                if (v.indexOf('{') >= 0) {
                    return (JSON.parse(v));
                } else {
                    return '';
                }
            });
        }
    }
    return result
}
//将YYYY-MM-DDTh:mm:ss的格式转换成YYYY/MM/DD h:mm:ss的格式。
// todo:因为无法判断来源数据的数据格式。目前只能强行要求后台将时间类型字段以Time关键词结尾。希望有更好的解决方法
export const FormatDataInfo = (data)=>{
    let Data = data.split("T")[0].replace(/-/g,'/');
    let Time = (data.split("T")[1].split("."))[0];
    return Data+' '+Time;
}

/*
 * 批量选择操作的数据组织逻辑
 * @param
 * OriginArr:来自reducer当前所有处于选中状态的菜单数组
 * itemBatched:来自action中被操作的菜单项
 * allMenu:全体菜单
 * */
export const batchOptionReducerDataOption = (OriginArr,itemBatched,allMenu)=>{
    let findAllChild = (item,allMenu)=>{
        let TempChild = [];
        if(allMenu.length>0){
            let newAllItem = allMenu.filter((v,k)=>{
                if(v.parentCode===item.code){
                    TempChild.push(v);
                }else{
                    return v;
                }
            });
            for(let i in TempChild){
                TempChild.concat(findAllChild(TempChild[i],newAllItem))
            }
        }
        return TempChild;

    }

    let reverseDeleteParentItem = (item,allOrignMenu)=>{
        let ParentItem = {};
        let isCouldDelete = true;
        for(let i in allOrignMenu){
            if(item.parentCode === allOrignMenu[i].id){
                ParentItem = allOrignMenu[i];
            }
            if(item.parentCode === allOrignMenu[i].parentCode){
                isCouldDelete = false
            }
        }
        if(isCouldDelete){
            return allOrignMenu.filter((v,k)=>{
                if(v.id!==ParentItem.id){
                    return v
                }
            })
        }else{
            return allOrignMenu;
        }


    }

    let reverseAddParentItem = (item,allMenu)=>{
        return allMenu.filter((v,k)=>{
            if(item.parentCode===v.code){
                return v;
            }
        });
    }

    let DeleteAllChild = (originArr,item,allMenu)=>{
        let child = findAllChild(item,allMenu);
        let result = originArr.filter((v,k)=>{
            let isNotDelete = true;
            for(let i in child){
                if(child[i].id === v.id){
                    isNotDelete = false;
                }
            }
            if(isNotDelete){
                return v;
            }
        });
        return result
    }
    let resultArr = [];
    let originArr = OriginArr;
    if (itemBatched.length > 2) {
        if (OriginArr.length === itemBatched.length) {
            resultArr = [];
        } else {
            resultArr = itemBatched;
        }
    } else {
        let tempResult = [];
        for (let i in itemBatched) {
            let isPush = true;
            for (let l in OriginArr) {
                if (itemBatched[i].id === OriginArr[l].id) {
                    originArr.splice(l,1);
                    originArr = DeleteAllChild(originArr,itemBatched[i],allMenu);
                    originArr = reverseDeleteParentItem(itemBatched[i],originArr);
                    isPush = false;
                }
            }
            if (isPush) {
                tempResult.push(itemBatched[i]);
                let ParentItem = [];
                let ParentItemFlag = true;
                for(let m in originArr){
                    if(originArr[m].code===itemBatched[i].parentCode){
                        ParentItemFlag = false;
                    }
                }
                if(ParentItemFlag){
                    ParentItem =  reverseAddParentItem(itemBatched[i],allMenu)
                }

                tempResult = tempResult.concat(findAllChild(itemBatched[i],allMenu)).concat(ParentItem);
            }
        }
        resultArr = tempResult.concat(originArr);
    }
    return resultArr;
}