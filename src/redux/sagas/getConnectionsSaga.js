import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import config from '../../modules/httpConfig';

function* fetchConnections(){
    try{
        const response = yield axios.get('/api/connections', config);
        yield put({type: 'SET_CONNECTIONS', payload: response.data});
    } catch (error) {
      console.log('Profile put request failed', error);
    }
  }
  
  function* getConnectionsSaga() {
    yield takeLatest('FETCH_CONNECTIONS', fetchConnections);
  }
  
  export default getConnectionsSaga;