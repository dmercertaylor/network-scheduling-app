import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import config from '../../modules/httpConfig';

function* fetchMatched(){
    try{
        const response = yield axios.get('/api/availability', config);
        yield put({type: 'SET_MATCHED_TIMES', payload: response.data});
    } catch (error) {
      console.log('Profile put request failed', error);
    }
  }
  
  function* getMatchedSaga() {
    yield takeLatest('FETCH_MATCHED_TIMES', fetchMatched);
  }
  
  export default getMatchedSaga;