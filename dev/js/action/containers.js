import * as Constants from './CONSTANTS';
export const AppDidMount = ()=>{
    return dispatch=>{
        let e = {
            sideBar:{
                userInfo:{
                    name:'Beaut-zihan',
                    power:'超级管理员',
                    imgUrl:'./img/profile_small.jpg'
                },
                menu: [{
                    "icon": "fa-home",
                    "id": 1,
                    "code": "11",
                    "parentCode": "0",
                    "url": "/#/",
                    "menuName": "管理员配置",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-01-11T00:00:00",
                    "updatetime": "2016-01-20T17:00:34"
                }, {
                    "id": 2,
                    "code": "1101",
                    "parentCode": "11",
                    "url": "/Role/",
                    "menuName": "角色配置",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-01-11T00:00:00",
                    "updatetime": "2016-01-20T16:18:30"
                }, {
                    "id": 3,
                    "code": "1102",
                    "parentCode": "11",
                    "url": "/Users/",
                    "menuName": "用户列表",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-01-11T00:00:00",
                    "updatetime": "2016-01-20T16:18:32"
                }, {
                    "id": 4,
                    "code": "1103",
                    "parentCode": "11",
                    "url": "/Menu/",
                    "menuName": "菜单管理",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-01-11T00:00:00",
                    "updatetime": "2016-01-26T13:07:44"
                }, {
                    "id": 15,
                    "code": "1104",
                    "parentCode": "11",
                    "url": "/Department/",
                    "menuName": "部门管理",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-01-11T00:00:00",
                    "updatetime": "2016-05-16T14:01:36"
                }, {
                    "icon":"fa-home",
                    "id": 56,
                    "code": "12",
                    "parentCode": "0",
                    "url": "/#/",
                    "menuName": "资讯采集",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-05-16T14:02:06",
                    "updatetime": "2016-05-16T14:02:06"
                }, {
                    "id": 57,
                    "code": "1201",
                    "parentCode": "12",
                    "url": "/Source/",
                    "menuName": "信源管理",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-05-16T14:03:26",
                    "updatetime": "2016-05-16T14:03:26"
                }, {
                    "id": 58,
                    "code": "1202",
                    "parentCode": "12",
                    "url": "/Material/",
                    "menuName": "素材存放",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-05-16T14:04:16",
                    "updatetime": "2016-05-18T15:13:07"
                }, {
                    "icon":"fa-home",
                    "id": 66,
                    "code": "13",
                    "parentCode": "0",
                    "url": "/#/",
                    "menuName": "修改密码",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-05-27T00:00:00",
                    "updatetime": "2016-05-27T00:00:00"
                }, {
                    "id": 67,
                    "code": "1301",
                    "parentCode": "13",
                    "url": "/ChangePassWord/",
                    "menuName": "修改密码",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-05-27T16:43:10",
                    "updatetime": "2016-05-27T16:43:10"
                }, {
                    "icon":"fa-home",
                    "id": 82,
                    "code": "15",
                    "parentCode": "0",
                    "url": "/#/",
                    "menuName": "会员管理",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-07-26T14:42:26",
                    "updatetime": "2016-07-26T14:42:26"
                }, {
                    "id": 83,
                    "code": "1501",
                    "parentCode": "15",
                    "url": "/Members/",
                    "menuName": "会员管理",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-07-26T14:44:20",
                    "updatetime": "2016-07-26T14:44:20"
                }, {
                    "id": 86,
                    "code": "1501",
                    "parentCode": "15",
                    "url": "/Orders/",
                    "menuName": "订单管理",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-09-14T13:58:32",
                    "updatetime": "2016-09-14T13:58:32"
                }, {
                    "id": 87,
                    "code": "1501",
                    "parentCode": "15",
                    "url": "/TeamOrders/",
                    "menuName": "团体订单",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-09-27T15:13:29",
                    "updatetime": "2016-09-27T15:13:29"
                }, {
                    "id": 88,
                    "code": "1501",
                    "parentCode": "15",
                    "url": "/PersonalOrders/",
                    "menuName": "个人订单",
                    "menuSort": 0,
                    "isEnable": true,
                    "createtime": "2016-09-27T15:13:57",
                    "updatetime": "2016-09-27T15:13:57"
                }]
            }
        };
        dispatch({
            type:Constants.INIT_CONTAINER_APP_DID_MOUNT,
            payload:e
        });
    }
}

