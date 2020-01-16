import axios from 'axios';
import { put, takeLatest, select } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* makeConnection(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    yield axios.post(`/api/connections/${action.payload}`, config);
  } catch (error) {
    console.log('Connect post request failed', error);
  }
}

function* connectSaga() {
  yield takeLatest('MAKE_CONNECTION', makeConnection);
}

export default connectSaga;