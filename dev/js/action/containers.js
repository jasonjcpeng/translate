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
                userMenu:[{icon:'fa-home',item_1:{target:'home',content:'主页'},item_2:[{target:'home-1',content:'主页一'},{target:'home-2',content:'主页二'},{target:'home-3',content:'主页三'}]},
                    {icon:'fa-columns',item_1:{target:'layout',content:'布局'}},
                    {icon:'fa-bar-chart',item_1:{target:'record',content:'统计图表'}},
                    {icon:'fa-envelope',item_1:{target:'mail',content:'信箱'}},
                    {icon:'fa-edit',item_1:{target:'table',content:'表单'}},
                    {icon:'fa-desktop',item_1:{target:'web',content:'页面'}}]
            }
        }
        dispatch({
            type:Constants.INIT_CONTAINER_APP_DID_MOUNT,
            payload:e
        });
    }
}

