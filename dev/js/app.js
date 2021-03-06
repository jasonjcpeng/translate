import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configCreateStore from './config/config-create-strore';

import App from './containers/app';

import allReducers from './reducers';

import '../scss/style.less';

const store = configCreateStore(allReducers);/* 利用中间件附加trunk（异步解决方案）的store生成器*/
store.subscribe(()=>{
    window.localStorage.setItem('store',JSON.stringify(store.getState()));
});

if(document.getElementById('root')){
    ReactDOM.render(<Provider store={store}>
        <App></App>
    </Provider>,document.getElementById('root'));
}


