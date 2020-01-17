import { all } from 'redux-saga/effects';
import authenticationSaga from './authentication';
import profileSaga from './profileSaga';
import updateAvailableSaga from './updateAvailableSaga';
import searchSaga from './searchSaga';
import connectSaga from './connectSaga';
import getConnectionsSaga from './getConnectionsSaga';
import getMatchedSaga from './getMatchedSaga';
// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    profileSaga(),
    updateAvailableSaga(),
    searchSaga(),
    connectSaga(),
    getConnectionsSaga(),
    getMatchedSaga(),
    ...authenticationSaga
  ]);
}
