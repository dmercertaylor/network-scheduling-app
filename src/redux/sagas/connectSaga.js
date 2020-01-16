import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* makeConnection(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    yield axios.post(`/api/connections/sendRequest`, action.payload, config);
    yield put({type: "SEARCH_CHANGE", payload: 'new'});
  } catch (error) {
    console.log('Connect post request failed', error);
  }
}

function* acceptConnection(action){
    try {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    };

    yield axios.put(
        `/api/connections/acceptConnection/${action.payload}`,
        config);
    yield put({type: "FETCH_CONNECTIONS"});
    } catch (error) {
        console.log('Connect post request failed', error);
    }
}

function* removeConnection(action){
  try {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    };

    yield axios.delete(`/api/connections/${action.payload}`, config);
    yield put({type: 'FETCH_CONNECTIONS'});
    } catch (error) {
        console.log('Connect post request failed', error);
    }
}

function* connectSaga() {
  yield takeLatest('MAKE_CONNECTION', makeConnection);
  yield takeLatest('ACCEPT_CONNECTION', acceptConnection);
  yield takeLatest('REMOVE_CONNECTION', removeConnection);
}

export default connectSaga;