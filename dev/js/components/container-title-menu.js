import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../action/container-tittle-menu';

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
            if ((this.refs.titleMenu.clientWidth) / 2 < cursor) {
                left = (cursor - ((this.refs.titleMenu.clientWidth - 228) / 2))-((cursor - ((this.refs.titleMenu.clientWidth - 228) / 2))%25);
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
                return 110- this.props.menuScrollX;
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
                className="fa fa-times-circle"></i></li>
        });
    }

    leftScroll(e) {
        if ((this.refs.titleMenu.clientWidth - 228) < this.props.limit && this.props.limit - this.props.menuScrollX > (this.refs.titleMenu.clientWidth - 228) / 3) {
            this.props.scroll(this.props.menuScrollX + e);
        }
    }

    rightScroll(e) {
        if (this.props.menuScrollX + e >= 0) {
            this.props.scroll(this.props.menuScrollX + e);
        }

    }

    createTitleScrollBar(){
        return(
            <div ref="titleMenu" className="title-menu">
                <div className="title-menu-button"><i className="fa fa-backward"></i></div>
                <div onWheel={e=>{
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
                <div className="title-menu-button title-menu-button-exit"><i className="fa fa-sign-out"></i>退出</div>
                <div className="title-menu-button title-menu-button-close">关闭操作 <i className="fa fa-caret-down"></i>
                </div>
                <div className="title-menu-button title-menu-button-forward"><i className="fa fa-forward"></i></div>
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
        limit: state.containerTitleMenu.limit,
        cursor: state.containerTitleMenu.cursor,
        activeContent:state.containerTitleMenu.activeContent,
        menuScrollX: state.containerTitleMenu.menuScrollX,
        defaultToggleStatus:state.common.defaultToggleStatus,
        toggleStatus:state.common.toggleStatus,
        lastToggleStatus: state.common.lastToggleStatus,
    });
}


function action(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(ContainerTittleMenu);
