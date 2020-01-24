import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import config from '../../modules/httpConfig';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchSearch(action) {
  try {
    const query = action.payload.query ?
      '?' + Object.keys(action.payload.query)
        .map(key => `${key}=${action.payload.query[key]}`).join('&') : '';

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get(`/api/search/${action.payload.searchTerm}${query}`, config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({
        type: 'SET_SEARCH_RESULTS',
        payload: {
          results: response.data,
          searchTerm: action.payload.searchTerm
        }
    });
  } catch (error) {
    console.log('Profile get request failed', error);
  }
}

function* searchSaga() {
  yield takeLatest('FETCH_SEARCH', fetchSearch);
}

export default searchSaga;