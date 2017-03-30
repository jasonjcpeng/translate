/**
 * 
 * Created by JasonPeng on 2017/3/30.
 */
class LoginModel{
    constructor(domId){
        this.domID = domId;
    }
    createView(){
        let root = window.document.getElementById(this.domID);
        let content = "<div></div>";
        root.innerHTML = "<div>aaaa</div>";
        console.log(root);
    }

}

(()=>{
    let loginModel = new LoginModel('login');
    loginModel.createView();
})();



