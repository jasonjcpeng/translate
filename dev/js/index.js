/**
 *
 * Created by JasonPeng on 2017/3/30.
 */
import {login} from './services/api';

class LoginModel {
    constructor(formUsername,formPassword,message,DomUserName, DomPsw, DomLogin, DomCanvas) {
        this.formUsername = window.document.getElementById(formUsername);
        this.message = window.document.getElementById(message);
        this.formPassword = window.document.getElementById(formPassword);
        this.userName = window.document.getElementById(DomUserName);
        this.passWord = window.document.getElementById(DomPsw);
        this.confirm = window.document.getElementById(DomLogin);
        this.canvas = window.document.getElementById(DomCanvas);
    }

    universialAniamtion() {
        //宇宙特效
        "use strict";
        var canvas = this.canvas,
            ctx = canvas.getContext('2d'),
            w = canvas.width = window.innerWidth,
            h = canvas.height = window.innerHeight,

            hue = 217,
            stars = [],
            count = 0,
            maxStars = 1300;//星星数量

        var canvas2 = document.createElement('canvas'),
            ctx2 = canvas2.getContext('2d');
        canvas2.width = 100;
        canvas2.height = 100;
        var half = canvas2.width / 2,
            gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
        gradient2.addColorStop(0.025, '#CCC');
        gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
        gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
        gradient2.addColorStop(1, 'transparent');

        ctx2.fillStyle = gradient2;
        ctx2.beginPath();
        ctx2.arc(half, half, half, 0, Math.PI * 2);
        ctx2.fill();

// End cache

        function random(min, max) {
            if (arguments.length < 2) {
                max = min;
                min = 0;
            }

            if (min > max) {
                var hold = max;
                max = min;
                min = hold;
            }

            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function maxOrbit(x, y) {
            var max = Math.max(x, y),
                diameter = Math.round(Math.sqrt(max * max + max * max));
            return diameter / 2;
            //星星移动范围，值越大范围越小，
        }

        var Star = function () {

            this.orbitRadius = random(maxOrbit(w, h));
            this.radius = random(60, this.orbitRadius) / 8;
            //星星大小
            this.orbitX = w / 2;
            this.orbitY = h / 2;
            this.timePassed = random(0, maxStars);
            this.speed = random(this.orbitRadius) / 400000;
            //星星移动速度
            this.alpha = random(2, 10) / 10;

            count++;
            stars[count] = this;
        }

        Star.prototype.draw = function () {
            var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
                y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
                twinkle = random(10);

            if (twinkle === 1 && this.alpha > 0) {
                this.alpha -= 0.05;
            } else if (twinkle === 2 && this.alpha < 1) {
                this.alpha += 0.05;
            }

            ctx.globalAlpha = this.alpha;
            ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
            this.timePassed += this.speed;
        }

        for (var i = 0; i < maxStars; i++) {
            new Star();
        }

        function animation() {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.5; //尾巴
            ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
            ctx.fillRect(0, 0, w, h)

            ctx.globalCompositeOperation = 'lighter';
            for (var i = 1, l = stars.length; i < l; i++) {
                stars[i].draw();
            }
            ;

            window.requestAnimationFrame(animation);
        }

        animation();
    }

    loginAction(){
        let userName = this.userName.value;
        let passWord = this.passWord.value;
        let that = this;
        login(userName, passWord).then((data)=> {
            if (data) {
                window.localStorage.setItem('login', 'login');
                window.location.href = './app.html';
            }
        }).catch(e=> {
            console.log(e)
            if(e==='账户不存在，请重新输入'){
                that.formUsername.className ='form-password animation-flipInY wrong';
                that.userName.className = 'wrong';
                that.message.innerHTML = '账户不存在，请重新输入';
            }else if(e==='密码不正确，请重新输入'){
                that.formPassword.className ='form-username animation-flipInY wrong';
                that.passWord.className = 'wrong';
                that.message.innerHTML = '密码不正确，请重新输入';
            }

        });
    }

    confirmBindAction() {
        let that = this;
        this.userName.addEventListener('focus',()=>{
            that.formUsername.className ='form-username active';
            that.userName.className = 'active';
            that.message.innerHTML = '';
        });
        this.userName.addEventListener('blur',()=>{
            that.formUsername.className ='form-username';
            that.userName.className = '';
        });

        this.passWord.addEventListener('focus',()=>{
            that.formPassword.className ='form-password active';
            that.passWord.className = 'active';
            that.message.innerHTML = '';
        });
        this.passWord.addEventListener('blur',()=>{
            that.formPassword.className ='form-password';
            that.passWord.className = '';
        });

        this.confirm.onclick = ()=> {
            this.loginAction();
        }
    }


    bindEnterListener() {
        document.body.addEventListener('keypress',(e)=>{
            if(e.keyCode===13){
                this.loginAction();
            }
        });
    }

    init() {
        window.localStorage.removeItem('store');
        window.localStorage.removeItem('login');
        this.confirmBindAction();
        this.universialAniamtion();
        this.bindEnterListener();
    }

}

(()=> {
    if (window.localStorage.getItem('login') === 'login') {
        window.location.href = './app.html';
    } else {
        document.body.innerHTML = '<div><div><div class="login-content">' +
            '<div  class="header-logo"><img src="data:image/png;base64,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" alt="logo"></div>' +
            '<div id="form-username" class="form-username" ><input class="" id="userName" type="text" placeholder="UserName"/><i class="fa fa-user"></i></div>' +
            '<div id="form-password" class="form-password"><input class="" id="passWord" type="password" placeholder="PassWord"/><i class="fa fa-lock"></i></div>' +
            '<div class="message" id="message"></div>' +
            '<button class="login-content-btn" id="confirm">Login</button>' +
            '</div>' +
            '<div class="canvas-bg"></div>' +
            '<canvas id="canvas"></canvas>' +
            '</div>' +
            '</div>';
        let loginModel = new LoginModel('form-username','form-password','message','userName', 'passWord', 'confirm', 'canvas');
        loginModel.init();
    }
})();



