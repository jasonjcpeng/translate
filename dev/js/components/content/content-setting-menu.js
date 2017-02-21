import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../../action/content-setting';

import Loader from 'react-loader';
import {LoaderOption} from '../../config/config';

class ContentSettingMenu extends React.Component {

    render() {
        let tableHeight = this.props.height - 80;
        return (<Loader loaded={true} options={LoaderOption}>
            <div className="content-container animation-fadeInRight">
                <div className="content-setting-header">header</div>
                <div className="content-container-inset" style={{height: tableHeight}}>
                    <table>
                        <thead>
                        <tr>
                            <th>名称</th>
                            <th>图标</th>
                            <th>API</th>
                            <th>展开</th>
                            <th>有效</th>
                            <th>介绍</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1123</td>
                            <td>123</td>
                            <td>123</td>
                            <td>123</td>
                            <td>123</td>
                            <td><i className="fa fa-toggle-off"></i></td>
                        </tr>
                        <tr>
                            <td>1123</td>
                            <td>123</td>
                            <td>123</td>
                            <td>123</td>
                            <td>123</td>
                            <td><i className="fa fa-toggle-on"></i></td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </Loader>);
    }
}

const state = state=> {
    return ({});
};

const action = dispatch=> {
    return bindActionCreators({}, dispatch);
}

export default connect(state, action)(ContentSettingMenu);