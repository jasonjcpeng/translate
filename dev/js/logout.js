class LogonOut{
    constructor(){
        this.loginStore = window.localStorage.getItem('login');
    }
    init(){
        if(!this.loginStore){
            window.location.href='../';
        }
    }
}


(()=>{
    let loginOut = new LogonOut();
    loginOut.init();
})();