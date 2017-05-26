/**
 *
 * Created by DaWi on 2017/5/15.
 */
import React from 'react';
/*
* 头像剪切
*
* */
class HeaderUpload extends React.Component {
    constructor(props) {
        super();
        this.state= {
            dataURL:'',
            style:props.style
        }
    }

    componentWillReceiveProps(props){
        this.state= {
            style:props.style
        }
    }

    handleFileInputOnChange(e) {
        let file = e.target.files[0];
        if(file){
            if (!/image\/\w+/.test(file.type)) {
                this.props.actionSendError('文件必须为图片！');
                return false;
            }
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {

                this.setState({
                    dataURL:e.target.result
                });
            }.bind(this);
        }
    }

    render() {
        let config = {
         dataURL:this.state.dataURL, // the image you want to cut
         imgScale:true,	//	if true ,user can scale image
         frameScale:true,	// if true , user can scale the cutting frame
         frameWidth:150,		// the cutting frame's default width
         frameHeight:150,	// the cutting frame's default height
         minW:150,	//	the cutting frame's min width
         minH:150,	//	the cutting frame's min height
         width:400,  //Cut's component's width
         }
        return <div >
            <div style={this.state.style}>
                <div className="file-upload">
                    <button className=" btn btn-finish">上传</button>
                    <input onChange={this.handleFileInputOnChange.bind(this)} ref="file" type="file"/></div>
                <Cutting config={config} getCutImage={(e,v)=>{
                    let promise = new Promise((resolve,reject)=>{
                        resolve(e);
                    });
                    this.props.callBackUrlData(promise);
                   }}></Cutting>
            </div>
        </div>
    }
}


export default HeaderUpload;


//引用别人的图片截取组件
var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var Cutting = _react2.default.createClass({
    displayName: 'Cutting',

    getInitialState: function getInitialState() {
        return {
            touch: {
                x: 0,
                y: 0
            },
            positionX: 0,
            positionY: 0,
            defaultPosition: {
                x: 0,
                y: 0
            },
            hasEnd: true,
            frameWidth: this.props.config.frameWidth ? this.props.config.frameWidth : '100%',
            frameHeight: this.props.config.frameHeight ? this.props.config.frameHeight : 200,
            defaultBtPosition: {
                x: 0,
                y: 0
            },
            defaultWidth: '100%',
            defaultHeight: 200,
            defaultPositionX: 0,
            defaultPositionY: 0,
            realImage: ''
        };
    },
    handleTouchStart: function handleTouchStart(e) {
        var touch = e;
        this.setState({
            touch: {
                x: touch.pageX,
                y: touch.pageY
            },
            defaultPosition: {
                x: this.state.positionX,
                y: this.state.positionY
            }
        });
    },
    handleTouchMove: function handleTouchMove(e) {
        e.preventDefault();
        if(e.pageX!==0&&e.pageY!==0){
            var touch = e,
                X = touch.pageX,
                Y = touch.pageY,
                startX = this.state.touch.x,
                startY = this.state.touch.y;
            var moveX = X - startX,
                moveY = Y - startY;
            if (this.state.defaultPosition.x + moveX > -1 && this.state.defaultPosition.x + moveX + this.refs.frame.clientWidth < this.refs.cutting.clientWidth - 1) {
                this.setState({
                    positionX: this.state.defaultPosition.x + moveX
                });
            }

            if (this.state.defaultPosition.x + moveX < 0) {
                this.setState({
                    positionX: 0
                });
            }

            if (this.state.defaultPosition.x + moveX + this.refs.frame.clientWidth > this.refs.cutting.clientWidth) {
                this.setState({
                    positionX: this.refs.cutting.clientWidth - this.refs.frame.clientWidth
                });
            }

            if (this.state.defaultPosition.y + moveY > -1 && this.state.defaultPosition.y + moveY + this.refs.frame.clientHeight < this.refs.cutting.clientHeight - 1) {
                this.setState({
                    positionY: this.state.defaultPosition.y + moveY
                });
            }

            if (this.state.defaultPosition.y + moveY < 0) {
                this.setState({
                    positionY: 0
                });
            }

            if (this.state.defaultPosition.y + moveY + this.refs.frame.clientHeight > this.refs.cutting.clientHeight - 1) {
                this.setState({
                    positionY: this.refs.cutting.clientHeight - this.refs.frame.clientHeight
                });
            }
        }

    },
    handleTouchEnd: function handleTouchEnd() {
        this.setState({
            hasEnd: true
        });
    },
    handleBtTouchStart: function handleBtTouchStart(e) {
        var touch = e;
        this.setState({
            defaultBtPosition: {
                x: touch.pageX,
                y: touch.pageY
            },
            defaultWidth: this.refs.frame.clientWidth,
            defaultHeight: this.refs.frame.clientHeight,
            defaultPositionX: this.state.positionX,
            defaultPositionY: this.state.positionY
        });
    },
    onTouchBtMove: function onTouchBtMove(num, e) {
        if (this.props.config.frameScale) {
            e.stopPropagation();
            e.preventDefault();
            if(e.pageX!==0&&e.pageY!==0){
                var touch = e,
                    moveX = touch.pageX - this.state.defaultBtPosition.x,
                    moveY = touch.pageY - this.state.defaultBtPosition.y;
                var minW = this.props.config.minW ? this.props.config.minW : 200,
                    minH = this.props.config.minH ? this.props.config.minH : 200;
                if (num == 'bt0' || num == 'bt2') {
                    if (this.state.defaultWidth - moveX > minW - 1) {
                        this.setState({
                            frameWidth: this.state.defaultWidth - moveX,
                            positionX: this.state.defaultPosition.x + moveX
                        });
                    }
                    if (this.state.defaultWidth - moveX < minW) {
                        this.setState({
                            frameWidth: minW,
                            positionX: this.state.defaultPosition.x + this.state.defaultWidth - minW
                        });
                    }
                    if (this.state.defaultPosition.x + moveX < 0) {
                        this.setState({
                            frameWidth: this.state.defaultWidth + this.state.defaultPositionX,
                            positionX: 0
                        });
                    }
                }
                if (num == 'bt0' || num == 'bt1') {
                    if (this.state.defaultHeight - moveY > minH - 1) {
                        this.setState({
                            frameHeight: this.state.defaultHeight - moveY,
                            positionY: this.state.defaultPosition.y + moveY
                        });
                    }
                    if (this.state.defaultHeight - moveY < minH) {
                        this.setState({
                            frameHeight: minH,
                            positionY: this.state.defaultPosition.y + this.state.defaultHeight - minH
                        });
                    }
                    if (this.state.defaultPosition.y + moveY < 0) {
                        this.setState({
                            frameHeight: this.state.defaultHeight + this.state.defaultPositionY,
                            positionY: 0
                        });
                    }
                }
                if (num == 'bt1' || num == 'bt3') {
                    if (this.state.defaultWidth + moveX > minW - 1) {
                        this.setState({
                            frameWidth: this.state.defaultWidth + moveX
                        });
                    }
                    if (this.state.defaultWidth + moveX + this.state.defaultPosition.x > this.refs.cutting.clientWidth) {
                        this.setState({
                            frameWidth: this.refs.cutting.clientWidth - this.state.defaultPosition.x
                        });
                    }
                    if (this.state.defaultWidth + moveX < minW) {
                        this.setState({
                            frameWidth: minW
                        });
                    }
                }
                if (num == 'bt2' || num == 'bt3') {
                    if (this.state.defaultHeight + moveY > minH - 1) {
                        this.setState({
                            frameHeight: this.state.defaultHeight + moveY
                        });
                    }
                    if (this.state.defaultHeight + moveY < minH) {
                        this.setState({
                            frameHeight: minH
                        });
                    }
                    if (this.state.defaultHeight + moveY + this.state.defaultPosition.y > this.refs.cutting.clientHeight) {
                        this.setState({
                            frameHeight: this.refs.cutting.clientHeight - this.state.defaultPosition.y
                        });
                    }
                }
            }
        }
    },
    cacheExternalImage: function cacheExternalImage(url) {
        var img = new Image();
        //img.crossOrigin = "anonymous";
        img.src = url;
        return img;
    },
    cutting: function cutting() {
        var img = this.cacheExternalImage(this.state.realImage),
            canvas = this.refs.canvas,
            ctx = canvas.getContext('2d');
        canvas.width = this.state.frameWidth;
        canvas.height = this.state.frameHeight;
        canvas.style.width = this.state.frameWidth + 'px';
        canvas.style.height = this.state.frameHeight + 'px';
        window.setTimeout(()=>{
            ctx.drawImage(img, this.state.positionX, this.state.positionY, this.state.frameWidth, this.state.frameHeight, 0, 0, this.state.frameWidth, this.state.frameHeight);
            this.props.getCutImage(canvas.toDataURL("image/jpeg",0.5), this.convertBase64UrlToBlob(canvas.toDataURL("image/jpeg",0.5)));
        },0);
    },
    copyImageToFixSize: function copyImageToFixSize(url) {
        var Images = new Image(),
            img = this.cacheExternalImage(url),
            that = this,
            canvas = this.refs.canvas,
            ctx = canvas.getContext('2d');
        Images.src = url;
        Images.onload = function () {
            canvas.style.height = that.refs.bgImg.clientHeight + 'px';
            canvas.style.width = that.refs.bgImg.clientWidth + 'px';
            canvas.height = that.refs.bgImg.clientHeight;
            canvas.width = that.refs.bgImg.clientWidth;
            ctx.drawImage(img, 0, 0, that.refs.bgImg.clientWidth, that.refs.bgImg.clientHeight);
            that.setState({
                realImage: canvas.toDataURL("image/jpeg",0.5)
            });
            that.initCut();
        };
    },
    initCut: function initCut() {
        var Images = new Image(),
            img = this.cacheExternalImage(this.state.realImage),
            that = this,
            canvas = this.refs.canvas,
            ctx = canvas.getContext('2d');
        canvas.width = this.state.frameWidth;
        canvas.height = this.state.frameHeight;
        canvas.style.width = this.state.frameWidth + 'px';
        canvas.style.height = this.state.frameHeight + 'px';
        ctx.drawImage(img, this.state.positionX, this.state.positionY, this.state.frameWidth, this.state.frameHeight, 0, 0, this.state.frameWidth, this.state.frameHeight);
    },
    convertBase64UrlToBlob: function convertBase64UrlToBlob(dataURI) {
        var byteString = void 0;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = unescape(dataURI.split(',')[1]);
        }
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    },
    componentDidMount: function componentDidMount() {
    },
    componentWillReceiveProps: function componentWillReceiveProps(next) {
        if (next.config.dataURL) {
            this.copyImageToFixSize(next.config.dataURL);
        }
    },
    render: function render() {
        let bgImg = this.props.config.dataURL?{ src: this.props.config.dataURL, className: 'bg-img', ref: 'bgImg',style: { width: this.props.config.width} }:{className: 'bg-img', ref: 'bgImg' };
        let img = this.props.config.dataURL?{ src: this.props.config.dataURL, style: { width: this.props.config.width, left: -this.state.positionX, top: -this.state.positionY } }:{style: { width: this.props.config.width, left: -this.state.positionX, top: -this.state.positionY } };
        let isCreateCutBt = this.props.config.dataURL?_react2.default.createElement(
            'div',
            { className: 'cutBt btn', onClick: this.cutting },
            '剪切'
        ):'';

        return _react2.default.createElement(
            'div',
            { className: 'cutting', ref: 'cutting' },
            _react2.default.createElement('img', bgImg),
            _react2.default.createElement(
                'div',
                { className: 'cover' },
                _react2.default.createElement(
                    'div',
                    { className: 'frame', ref: 'frame',draggable:true, style: { left: this.state.positionX, top: this.state.positionY, width: this.state.frameWidth, height: this.state.frameHeight }, onDragStart: this.handleTouchStart, onDrag: this.handleTouchMove, onDragEnd: this.handleTouchEnd },
                    _react2.default.createElement('span', {draggable:true, style: this.props.config.frameScale ? { display: 'block' } : { display: 'none' }, onDragStart: this.handleBtTouchStart, onDrag: this.onTouchBtMove.bind(null, 'bt0') }),
                    _react2.default.createElement('span', { draggable:true,style: this.props.config.frameScale ? { display: 'block' } : { display: 'none' }, onDragStart: this.handleBtTouchStart, onDrag: this.onTouchBtMove.bind(null, 'bt1') }),
                    _react2.default.createElement('span', { draggable:true,style: this.props.config.frameScale ? { display: 'block' } : { display: 'none' }, onDragStart: this.handleBtTouchStart, onDrag: this.onTouchBtMove.bind(null, 'bt2') }),
                    _react2.default.createElement('span', {draggable:true, style: this.props.config.frameScale ? { display: 'block' } : { display: 'none' }, onDragStart: this.handleBtTouchStart, onDrag: this.onTouchBtMove.bind(null, 'bt3') }),
                    _react2.default.createElement('img',img),
                    _react2.default.createElement('div', null)
                )
            ),
            _react2.default.createElement('canvas', { ref: 'canvas'}),
            isCreateCutBt
        );
    }
});

//# sourceMappingURL=index.js.map