import { combineReducers } from 'redux';
import instaReducer from './insta';

const rootReducer = combineReducers({
  insta: instaReducer,
});

export default rootReducer;
