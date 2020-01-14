import React, { useState, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, FormControl, InputLabel, Input,
  FormHelperText, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles( theme => ({ 
  registerPage: {
    textAlign: 'center',
    marginTop: '24px'
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
  const avatar = useRef();

  const registerUser = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (username && password && email ) {
      dispatch({
        type: 'REGISTER',
        payload: { username, password, email, company, location, contact, name }
      });
    } else {
      dispatch({type: 'REGISTRATION_INPUT_ERROR'});
    }
  } // end registerUser

  return (
    <div className={classes.registerPage}>
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
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            name="username"
          />
        </div>
        <div>
          <TextField
            required
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            name="name"
          />
        </div>
        <div>
          <TextField
            required
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            name="email"
          />
        </div>
        <div>
          <TextField
            required
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
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Contact Method"
            value={contact}
            onChange={e => setContact(e.target.value)}
          />
        </div>
        <div className={classes.imageInput}>
          <label htmlFor="avatar-input">
            Profile Image
          </label>
          <Button
            color="primary"
            component="span"
          >
            <input
              id="avatar-input"
              aria-describedby="avatar-input-helper"
              type='file'
              accept='image/*'
              ref={avatar}
              style={{display: 'none'}}
              multiple={false}
            />
          </Button>
          <Typography
            component='p'
            variant='caption'
            id="avatar-input-helper"
          >
            For best results, choose a 1:1 image with the subject center
          </Typography>
        </div>
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

/*

  onClose() {
    this.setState({preview: null})
  }
  
  onCrop(preview) {
    this.setState({preview})
  }
 
  onBeforeFileLoad(elem) {
    if(elem.target.files[0].size > 71680){
      alert("File is too big!");
      elem.target.value = "";
    };
  }
  
  render () {
    return (
      <div>
        <Avatar
          width={390}
          height={295}
          onCrop={this.onCrop}
          onClose={this.onClose}
          onBeforeFileLoad={this.onBeforeFileLoad}
          src={this.state.src}
        />
        <img src={this.state.preview} alt="Preview" />
      </div>
    )
  }
}
*/