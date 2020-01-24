import { combineReducers } from 'redux';
import loading from './loadingReducer';
import authenticationReducers from './authentication/index';

// creates a reducer that, when the correct string is sent, sets state to action.payload.
const createReducer = (str, type=[]) => {
    return (state=type, action) => action.type === str ? action.payload : state;
}

const stateReducer = combineReducers({
    loading,
    profile: createReducer('SET_PROFILE'),
    searchResults: createReducer('SET_SEARCH_RESULTS'),
    searchChange: createReducer('SEARCH_CHANGE'),
    connections: createReducer('SET_CONNECTIONS'),
    matched: createReducer('SET_MATCHED_TIMES'),
    newMessages: createReducer('SET_NEW_MESSAGES'),
    allMessages: createReducer('SET_ALL_MESSAGES'),
    ...authenticationReducers // reducers regaurding login
});

const rootReducer = (state, action) => {
    if (action.type === 'UNSET_USER') {
        state = undefined
    }

    return stateReducer(state, action)
}
export default rootReducer;