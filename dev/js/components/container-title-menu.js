import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/container-tittle-menu';
import {fullScreen,exitFullScreen,IsPC} from '../config/tools';

class ContainerTittleMenu extends Component {
    //计算滚动限制，以及游标位置
    componentDidUpdate(){
        if(this.props.defaultToggleStatus ==='full'?true:false){
            let limit = 0;
            let cursor = 0;
            let flag = true;
            this.allItem.map(e=> {
                limit += this.refs[e].clientWidth;
                if (this.refs[e].className !== 'active' && flag) {
                    cursor += this.refs[e].clientWidth;
                } else {
                    if (flag) {
                        cursor += this.refs[e].clientWidth;
                    }
                    flag = false;
                }
            });
            let left = 0;
            if ((this.refs.titleMenu.clientWidth)-150 < cursor) {
                left = (cursor - ((this.refs.titleMenu.clientWidth - 166)-150))-((cursor - ((this.refs.titleMenu.clientWidth - 166)-150))%25);
            }
            this.props.setLimitAndCursor(limit, left);
        }
    }

    getContainerTittleMenuLeft(){
        switch (this.props.toggleStatus){
            case 'full':
                return 260 - this.props.menuScrollX;
                break;
            case 'mini':
                return 90- this.props.menuScrollX;
                break;
        }
    }

    getContainerTittleMenuLeftAnimation(){
        switch (this.props.lastToggleStatus){
            case 'full':
                switch (this.props.toggleStatus){
                    case 'mini':
                        return 'container-title-menu-full-to-mini';
                        break;
                    case 'none':
                        return '';
                        break;
                }
                break;
            case 'mini':
                switch (this.props.toggleStatus){
                    case 'full':
                        return 'container-title-menu-mini-to-full';
                        break;
                    case 'none':
                        return '';
                        break;
                }
                break;
            case 'none':
                switch (this.props.toggleStatus){
                    case 'full':
                        return '';
                        break;
                    case 'mini':
                        return '';
                        break;
                }
                break;
        }
    }

    createScrollMenuItem(){
        this.allItem = [];
        return this.props.activeContent.map((v, k)=> {
            this.allItem.push('item_' + k);
            return <li onClick={()=>{
                this.props.selectActiveContent(v);
                }} ref={'item_' + k} className={v.active ? 'active' : ''} key={v.obj.id}>{v.obj.menuName}<i
                className="fa fa-times-circle" onClick={(e)=> {
                this.deleteActiveContent(v, k);
                e.stopPropagation();
            }}></i></li>
        });
    }

    leftScroll(e) {
        if ((this.refs.titleMenu.clientWidth - 166) < this.props.limit && this.props.limit - this.props.menuScrollX > (this.refs.titleMenu.clientWidth - 166) / 3) {
            this.props.scroll(this.props.menuScrollX + e);
        }
    }

    rightScroll(e) {
        if (this.props.menuScrollX + e >= 0) {
            this.props.scroll(this.props.menuScrollX + e);
        }

    }

    deleteActiveContent(v, k) {
        this.props.deleteActiveContent(k,this.props.nowOnContent);
        let result = null;
            if (k > 0 && k + 1 === this.props.activeContent.length) {
                result = this.props.activeContent[k - 1];
            } else if (this.props.activeContent.length > 0) {
                result = this.props.activeContent[k + 1];
            }
            result ? this.props.selectActiveContent(result) : '';
    }

    selectForBack() {
        let result = null;
        if (this.props.activeContent.length > 1) {
            this.props.activeContent.forEach((v, k)=> {
                if (v.active) {
                    result = this.props.activeContent[k - 1];
                }
            });
        }
        return result;
    }

    selectForWard() {
        let result = null;
        if (this.props.activeContent.length > 0) {
            this.props.activeContent.forEach((v, k)=> {
                if (v.active) {
                    result = this.props.activeContent[k + 1];
                }
            });
        }
        return result;
    }

    createDropMenu(){
        if(this.props.closeOptionToggle){
            return (<ul className="title-menu-drop-down animation-fadeIn">
                <li className="top" onClick={()=>{this.props.forkActiveItem()}}>定位当前选项卡</li>
                <li onClick={()=>{this.props.closeOtherItem(this.props.nowOnContent)}}>关闭其他选项卡</li>
                <li onClick={()=>{this.props.closeAllItem()}}>关闭全部选项卡</li>
            </ul>);
        }else{
            return '';
        }

    }
    createFullOrMinIcon(){
        if(this.props.isFullScreen){
            return 'fa fa-window-restore';
        }else{
            return 'fa fa-window-maximize';
        }
    }

    createCloseOptionAndFullScreenToggle(){
        if(IsPC()){
            return (<div>
                <div className={'title-menu-button title-menu-button-full '+(this.props.isFullScreen?'active':'')} onClick={()=>{
                    this.createCloseOptionAndFullScreenToggle();
                    if(!this.props.isFullScreen){
                        fullScreen(document.documentElement);
                    }else{
                        exitFullScreen();
                    }
                    this.props.toggleFullScreen();
                }}><i className={this.createFullOrMinIcon()}></i>
                </div>
                <div className={'title-menu-button title-menu-button-full '+(this.props.closeOptionToggle?'active':'') } onClick={()=>{
                    this.props.closeOption();
                }}><i className="fa fa-caret-down"></i>
                    {this.createDropMenu()}
                </div>
            </div>);
        }else{
            return (<div className={'title-menu-button title-menu-button-mobile '+(this.props.closeOptionToggle?'active':'') } onClick={()=>{
                this.props.closeOption();
            }}><i className="fa fa-caret-down"></i>
                {this.createDropMenu()}
            </div>
            );
        }
    }

    createTitleScrollBar(){
        let touch = 0;
        return(
            <div ref="titleMenu" className="title-menu">
                <div onClick={()=> {
                    let e = this.selectForBack();
                    if (e) {
                        this.props.selectActiveContent(e);
                    }
                }} className="title-menu-button"><i className="fa fa-backward"></i></div>
                <div
                    onTouchMove={e=> {
                        if (touch === 0) {
                            touch = e.changedTouches[0].pageX;
                        } else {
                            let move = e.changedTouches[0].pageX - touch;
                            touch = e.changedTouches[0].pageX;
                            if (move < 0) {
                                this.leftScroll(-move*2);
                            } else if (move > 0) {
                                this.rightScroll(-move*2);
                            }
                        }
                    }}
                    onTouchEnd={e=> {
                        touch = 0;
                    }}

                    onWheel={e=> {
                    if (e.deltaY < 0) {
                        this.rightScroll(e.deltaY / 4);
                    } else if (e.deltaY > 0) {
                        this.leftScroll(e.deltaY / 4);
                    }
                }
                } className={"title-menu-container "+this.getContainerTittleMenuLeftAnimation()} style={{left:this.getContainerTittleMenuLeft()+'px'}}>
                    <ul className="animation-fadeIn">
                        {this.createScrollMenuItem()}
                    </ul>
                </div>
                {this.createCloseOptionAndFullScreenToggle()}
                <div onClick={()=> {
                    let e = this.selectForWard();
                    if (e) {
                        this.props.selectActiveContent(e);
                    }
                }} className="title-menu-button title-menu-button-forward"><i className="fa fa-forward"></i></div>
            </div>
        );
    }
    render(){
        if (this.props.defaultToggleStatus ==='full'?true:false) {
            return (
                this.createTitleScrollBar()
            );
        } else {
            return (<div></div>);
        }
    }
}

function state(state) {
    return ({
        closeOptionToggle:state.containerTitleMenu.closeOptionToggle,
        limit: state.containerTitleMenu.limit,
        cursor: state.containerTitleMenu.cursor,
        activeContent:state.containerTitleMenu.activeContent,
        nowOnContent:state.common.nowOnContentTarget,
        menuScrollX: state.containerTitleMenu.menuScrollX,
        defaultToggleStatus:state.common.defaultToggleStatus,
        toggleStatus:state.common.toggleStatus,
        lastToggleStatus: state.common.lastToggleStatus,
        isFullScreen:state.common.isFullScreen
    });
}


function action(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(ContainerTittleMenu);
