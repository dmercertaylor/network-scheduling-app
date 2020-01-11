import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function LoginPage(){
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(state => state.errors);

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username,
          password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  } // end login

  return (
    <div>
      {errors.loginMessage && (
        <h2
          className="alert"
          role="alert"
        >
          {errors.loginMessage}
        </h2>
      )}
      <form onSubmit={login}>
        <h1>Login</h1>
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
            className="log-in"
            type="submit"
            name="submit"
            value="Log In"
          />
        </div>
      </form>
      <center>
        <button
          type="button"
          className="link-button"
          onClick={() => {dispatch({type: 'SET_TO_REGISTER_MODE'})}}
        >
          Register
        </button>
      </center>
    </div>
  );
}