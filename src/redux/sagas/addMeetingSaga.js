import axios from 'axios';
import { takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* putNewMeeting(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    yield axios.put(`/api/connections/newMeeting/${action.payload.friend_id}`,
        {date: action.payload.date}, config);
  } catch (error) {
    console.log('Update last met failed', error);
  }
}

function* putNewSkip(action){
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    yield axios.put(`/api/connections/skip/${action.payload.friend_id}`, config);
  } catch (error) {
    console.log('Update last met failed', error);
  }
}

function* addMeetingSaga() {
  yield takeLatest('ADD_MEETING', putNewMeeting);
  yield takeLatest('ADD_SKIP', putNewSkip);
}

export default addMeetingSaga;