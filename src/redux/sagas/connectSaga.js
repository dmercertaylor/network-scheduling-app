import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import config from '../../modules/httpConfig';

let unique = 0;
// worker Saga: will be fired on "FETCH_USER" actions
function* makeConnection(action) {
  try {
    yield axios.post(`/api/connections/sendRequest`, action.payload, config);
    yield put({type: "SEARCH_CHANGE", payload: unique++});
  } catch (error) {
    console.log('Connect post request failed', error);
  }
}

function* acceptConnection(action){
    try {
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