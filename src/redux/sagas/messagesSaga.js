import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Gets 64 messages from the server related to action.payload.friend_id
function* fetchAllMessages(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const offset = action.payload.offset ? `?offset=${action.payload.offset}`:'';
    const response = yield axios.get(
        `/api/messages/${action.payload.friend_id}${offset}`, config);

    yield put({ type: 'SET_ALL_MESSAGES', payload: response.data });
  } catch (error) {
    console.log('All messages get request failed', error);
  }
}

function* fetchNewMessages(action){
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.get(`/api/messages/${action.payload.friend_id}`, config);

    yield put({type: 'SET_NEW_MESSAGES', payload: response.data});
  } catch (error) {
    console.log('New messages get request failed', error);
  }
}

function* sendMessage(action){
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.post(`/api/messages/${action.payload.friend_id}`,
      {content: action.payload.content},config);
  } catch (error) {
    console.log('Message send error', error);
  }
}

function* messagesSaga() {
  yield takeLatest('FETCH_ALL_MESSAGES', fetchAllMessages);
  yield takeLatest('FETCH_NEW_MESSAGES', fetchNewMessages);
  yield takeLatest('SEND_MESSAGE', sendMessage);
}

export default messagesSaga;
