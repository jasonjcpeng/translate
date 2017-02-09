import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/content-setting';

import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';
import Pager from './pager';

class ContentSetting extends React.Component{

    componentWillUpdate(){
        console.log('ContentSetting update!')
    }

    render(){
        console.log(this.props.contentSetting.count)
        return (<Loader loaded={true} options={LoaderOption}>
            <div className="content-setting animation-fadeIn">
                <Pager count={this.props.contentSetting.count}></Pager>
                 <button onClick={()=>{
                     this.props.count(this.props.contentSetting.count);
                 }}>+++++</button>
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
