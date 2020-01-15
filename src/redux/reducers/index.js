import { combineReducers } from 'redux';
import loading from './loadingReducer';
import profile from './profileReducer';
import authenticationReducers from './authentication/index';
import searchResults from './searchResultsReducer';

const rootReducer = combineReducers({
    loading,
    profile,
    searchResults,
    ...authenticationReducers // reducers regaurding login
});

export default rootReducer;