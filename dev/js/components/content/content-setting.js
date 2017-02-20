import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/content-setting';

import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
import Pager from '../pager';

class ContentSetting extends React.Component {
    componentWillMount() {
        if (!this.props.status) {
            this.props.contentSettingGetMount(this.props.nowOnContentTarget);
        }
    }

    render() {
        if(this.props.status){
            return (
                <div className="content-setting animation-fadeInRight">
                    <Pager count={this.props.status.count} conutPayload={(count)=>{
                this.props.actionCount(count);
                }}></Pager>
                </div>
             );
        }else{
            return (<Loader loaded={false} options={LoaderOption}></Loader>);
        }

    }
}

const state = state=> {
    let status;
    state.containerTitleMenu.activeContent.map(v=> {
        if (v.obj.id===state.common.nowOnContentTarget.id) {
            status = v.status;
        }
    });
    return ({
        status: status,
    });
}

const action = dispatch=> {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(state, action)(ContentSetting);
