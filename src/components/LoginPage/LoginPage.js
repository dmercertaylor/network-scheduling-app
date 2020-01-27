import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles( theme => ({ 
  loginPage: {
    textAlign: 'center',
    marginTop: '24px'
  },
  row: {
    margin: '12px'
  },
  alert: {
    backgroundColor: theme.palette.error.dark,
    padding: '0.25rem',
    color: theme.palette.error.contrastText
  },
  buttonRow: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'center'
  },
  button: {
    margin: '12px'
  },
  loginInput: {
    minWidth: '10rem',
    width: '55vw',
    maxWidth: '18rem',
    margin: '8px 0'
  },
}));

export default function LoginPage(){
  const dispatch = useDispatch();

  const theme = useTheme();
  const classes = useStyles(theme);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(state => state.errors);

  const login = (event) => {
    event.preventDefault();
    event.stopPropagation();

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
    <div className={classes.loginPage}>
      <Typography
        component='h1'
        variant='h4'
      >
        Login
      </Typography>
      <form onSubmit={login}>
        <div className={classes.row}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            variant="standard"
            className={classes.loginInput}
            autoFocus
          />
        </div>
        <div className={classes.row}>
          <TextField
            type="password"
            label="Password"
            value={password}
            className={classes.loginInput}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {errors.loginMessage && (
          <Typography
            variant='body2'
            className={classes.alert}
            role="alert"
          >
            {errors.loginMessage}
          </Typography>
        )}
        <div className={classes.buttonRow}>
          <Button
            variant="contained"
            value="Log In"
            color="primary"
            onClick={login}
            className={classes.button}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            onClick={() => {dispatch({type: 'SET_TO_REGISTER_MODE'})}}
            className={classes.button}
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}