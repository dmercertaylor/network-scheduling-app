import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import config from '../../modules/httpConfig';

// Gets 64 messages from the server related to action.payload.friend_id
function* fetchMessages(action) {
  try {
    const offset = action.payload.offset ? `?offset=${action.payload.offset}`:'';
    const response = yield axios.get(
        `/api/messages/${action.payload.friend_id}${offset}`, config);

    yield put({ type: 'SET_ALL_MESSAGES', payload: response.data });
  } catch (error) {
    console.log('All messages get request failed', error);
  }
}

function* messagesSaga() {
  yield takeLatest('FETCH_MESSAGES', fetchAllMessages);
  // yield takeLatest('SEND_MESSAGE', sendMessage);
}

export default messagesSaga;
