import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import config from '../../modules/httpConfig';

// worker Saga: will be fired on "FETCH_USER" actions
function* putTimes(action) {
  try {
    yield axios.put('/api/profile/updateTimes', action.payload, config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'FETCH_PROFILE' });
  } catch (error) {
    console.log('Profile get request failed', error);
  }
}

function* updateAvailableSaga() {
  yield takeLatest('UPDATE_TIMES_AVAILABLE', putTimes);
}

export default updateAvailableSaga;
