import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/content-setting';

import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
import Pager from '../pager';

class ContentSetting extends React.Component{


    render(){
        return (<Loader loaded={true} options={LoaderOption}>
            <div className="content-setting animation-fadeIn">
                <Pager count={this.props.contentSetting.count} plusOnClick={function(count){
                        this.props.actionCount(count);
                }.bind(this)}></Pager>
            </div>
        </Loader> );
    }
}

const state = state=>{
    return ({
        contentSetting:state.contentSetting
    });
}

const action = dispatch=>{
    return bindActionCreators(ActionCreators,dispatch);
}


export default connect(state,action)(ContentSetting);
