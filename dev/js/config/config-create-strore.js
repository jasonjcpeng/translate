import {createStore,applyMiddleware,compose,preloadedState} from 'redux';
import thunk from 'redux-thunk';
export default function (reducer) {
    let store = compose(applyMiddleware(thunk))(createStore)(reducer, preloadedState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    return store;
}

