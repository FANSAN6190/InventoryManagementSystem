import { combineReducers } from 'redux';
import inventoryReducer from './selectInvReducer';

const rootReducer = combineReducers({
  inventory: inventoryReducer,
});

export default rootReducer;