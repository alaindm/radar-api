import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reducers from './reducers';
import reduxThunk from 'redux-thunk';
import App from './App';
import './index.css';
// import registerServiceWorker from './registerServiceWorker';

injectTapEventPlugin();



/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = composeEnhancers(applyMiddleware(reduxThunk))(createStore);
const store = createStoreWithMiddleware(reducers);
/* eslint-enable */



// const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
// const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));

// registerServiceWorker();
