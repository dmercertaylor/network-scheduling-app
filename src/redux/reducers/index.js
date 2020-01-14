import { combineReducers } from 'redux';
import loading from './loadingReducer';
import profile from './profileReducer';
import authenticationReducers from './authentication/index';

const rootReducer = combineReducers({
    loading,
    profile,
    ...authenticationReducers // reducers regaurding login
});

export default rootReducer;