import loginSaga from './loginSaga';
import registrationSaga from './registrationSaga';
import userSaga from './userSaga';

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default [loginSaga(), registrationSaga(), userSaga()];
