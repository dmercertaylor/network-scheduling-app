import { combineReducers } from 'redux';

import authenticationReducers from './authentication/index';

const rootReducer = combineReducers({
    ...authenticationReducers // reducers regaurding login
});

export default rootReducer;