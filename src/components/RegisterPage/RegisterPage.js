import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';

export default function RegisterPage(){
  
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'REGISTER',
        payload: { username, password }
      });
    } else {
      dispatch({type: 'REGISTRATION_INPUT_ERROR'});
    }
  } // end registerUser

  return (
    <div>
      {errors.registrationMessage && (
        <h2
          className="alert"
          role="alert"
        >
          {errors.registrationMessage}
        </h2>
      )}
      <form onSubmit={registerUser}>
        <h1>Register User</h1>
        <div>
          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <input
            className="register"
            type="submit"
            name="submit"
            value="Register"
          />
        </div>
      </form>
      <center>
        <button
          type="button"
          className="link-button"
          onClick={() => { dispatch({type: 'SET_TO_LOGIN_MODE'}) }}
        >
          Login
        </button>
      </center>
    </div>
  );
}

