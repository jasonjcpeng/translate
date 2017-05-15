/**
 *
 * Created by JasonPeng on 2017/3/30.
 */
import {login} from './services/api';
import * as IMG from './config/logo-img-base64';

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
            '<div  class="header-logo"><img id="logo" src="" alt="logo"></div>' +
            '<div id="form-username" class="form-username" ><input class="" id="userName" type="text" placeholder="UserName"/><i class="fa fa-user"></i></div>' +
            '<div id="form-password" class="form-password"><input class="" id="passWord" type="password" placeholder="PassWord"/><i class="fa fa-lock"></i></div>' +
            '<div class="message" id="message"></div>' +
            '<button class="login-content-btn" id="confirm">Login</button>' +
            '</div>' +
            '<div class="canvas-bg"></div>' +
            '<canvas id="canvas"></canvas>' +
            '</div>' +
            '</div>';
        document.getElementById('logo').src = IMG.Logo;
        let loginModel = new LoginModel('form-username','form-password','message','userName', 'passWord', 'confirm', 'canvas');
        loginModel.init();
    }
})();



