import { combineReducers } from 'redux';
import loading from './loadingReducer';
import profile from './profileReducer';
import authenticationReducers from './authentication/index';
import searchResults from './searchResultsReducer';
import searchChange from './searchChangeReducer';

const stateReducer = combineReducers({
    loading,
    profile,
    searchResults,
    searchChange,
    ...authenticationReducers // reducers regaurding login
});

const rootReducer = (state, action) => {
    if (action.type === 'UNSET_USER') {
        state = undefined
    }

    return stateReducer(state, action)
}
export default rootReducer;