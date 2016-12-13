import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configCreateStore from './config/configCreateStrore';
/*路由 hashHistory：hash URL ， browserHistory:原生浏览器URL 使用browserHistory将无法手动输入URL跳转*/

import App from './containers/app';

import allReducers from './reducers';

import '../scss/style.scss';

const store = configCreateStore(allReducers);/* 利用中间件附加trunk（异步解决方案）的store生成器*/

ReactDOM.render(<Provider store={store}>
    <App></App>
</Provider>,document.getElementById('root'));
