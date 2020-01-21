import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, TextField, Typography } from '@material-ui/core';
import AvatarUpload from '../AvatarUpload/AvatarUpload';
import LoadingModal from '../LoadingModal/LoadingModal';

const useStyles = makeStyles( theme => ({ 
  registerPage: {
    textAlign: 'center',
    marginTop: '24px'
  },
  registrationInput: {
    minWidth: '10rem',
    width: '75vw',
    maxWidth: '18rem',
    margin: '8px 0'
  },
  header: {
    marginBottom: '0px'
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
  imageInput: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '16rem',
    margin: '16px auto',
    textAlign: 'center'
  }
}));

export default function RegisterPage(){
  
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);

  const theme = useTheme();
  const classes = useStyles(theme);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  const registerUser = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (username && password && email ) {
      dispatch({
        type: 'REGISTER',
        payload: { username, password, email,
            company, location, contact,
            name, avatar }
      });
    } else {
      dispatch({type: 'REGISTRATION_INPUT_ERROR'});
    }
  } // end registerUser

  return (
    <div className={classes.registerPage}>
      <LoadingModal />
      {errors.registrationMessage && (
        <Typography
          variant='body1'
          className={classes.alert}
          role="alert"
        >
          {errors.registrationMessage}
        </Typography>
      )}
      <form onSubmit={registerUser}>
        <h1 className={classes.header}>Register User</h1>
        <div>
          <TextField
            required
            className={classes.registrationInput}
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            name="username"
          />
        </div>
        <div>
          <TextField
            required
            className={classes.registrationInput}
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            name="name"
          />
        </div>
        <div>
          <TextField
            required
            className={classes.registrationInput}
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            name="email"
          />
        </div>
        <div>
          <TextField
            required
            className={classes.registrationInput}
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            name="password"
          />
        </div>
        <div>
          <TextField
            label="Company"
            className={classes.registrationInput}
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Location"
            className={classes.registrationInput}
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Contact"
            className={classes.registrationInput}
            value={contact}
            onChange={e => setContact(e.target.value)}
            helperText="Enter a phone number, email, or other way you'd prefer people to contact you."
          />
        </div>
        <AvatarUpload
          onClose={img => setAvatar(img)}
        />
        <div className={classes.buttonRow}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={registerUser}
          >
            Register
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => { dispatch({type: 'SET_TO_LOGIN_MODE'}) }}
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}