import React, {useState, useEffect, useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WeekTimeInput from './WeekTimeInput';
import { makeStyles, useTheme, Typography, Switch, Button, TextField } from '@material-ui/core';
import AvatarUpload from '../AvatarUpload/AvatarUpload';
import LoadingModal from '../LoadingModal/LoadingModal';

const useStyle = makeStyles(theme => ({
  body: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%',
    marginTop: '16px'
  },
  switchContainer: {
    alignSelf: 'flex-end',
    margin: '0 16px 16px 0'
  },
  profilePicture: {
    height: '40vw',
    width: '40vw',
    minWidth: '64px',
    maxWidth: '256px',
    maxHeight: '256px',
    border: '4px solid ' + theme.palette.text.primary,
    borderRadius: '50%',
    margin: '8px'
  },
  imgWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: '50%'
  },
  logOutButton: {
    marginBottom: '16px'
  },
  margin1: {
    margin: '8px 0',
    maxWidth: '18rem',
    width: '65vw',
  },
  buttonRow: {
    display: 'flex',
    flexFlow: 'row nowrap',
    width: '65vw',
    justifyContent: 'space-around'
  }
}));

function ProfileInputFields(props){
  const close = props.close;
  const theme = useTheme();
  const classes = useStyle(theme);
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();

  const [name, setName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email);
  const [company, setCompany] = useState(profile.company);
  const [location, setLocation] = useState(profile.location);
  const [contact, setContact] = useState(profile.preferred_contact);
  const [avatar, setAvatar] = useState(false);

  const onSubmit = () => {
    const payload = {};
    if(profile.full_name !== name) payload.full_name = name;
    if(profile.email !== email) payload.email = email;
    if(profile.company !== company) payload.company = company;
    if(profile.location !== location) payload.location = location;
    if(profile.contact !== contact) payload.preferred_contact = contact;
    if(avatar) payload.avatar = avatar;

    if(Object.keys(payload).length > 0){
      dispatch({
        type: 'UPDATE_PROFILE',
        payload
      });
    }
    close();
  }

  const onCancel = () => {
    setName(profile.full_name);
    setEmail(profile.email);
    setCompany(profile.company);
    setLocation(profile.location);
    setContact(profile.preferred_contact);
    setAvatar(false);
    close();
  }

  return (
    <>
      <AvatarUpload
        onClose={img => setAvatar(img)}
      />
      <div>
        <TextField
          className={classes.margin1}
          label="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <TextField
          className={classes.margin1}
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <TextField
        label="Company"
        className={classes.margin1}
        value={company}
        onChange={e => setCompany(e.target.value)}
      />
      <TextField
        label="Location"
        className={classes.margin1}
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <div>
        <TextField
          label="Contact"
          className={classes.margin1}
          value={contact}
          onChange={e => setContact(e.target.value)}
          helperText="Enter a phone number, email, or other way you'd prefer people to contact you."
        />
      </div>
      <div className={classes.buttonRow}>
        <Button color='secondary' variant='contained'
        onClick={onCancel}
        >
          Cancel
        </Button>
        <Button color='primary' variant='contained'
        onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </>
  );
}

export default function UserPage(){
  const theme = useTheme();
  const classes = useStyle(theme);
  
  const dispatch = useCallback(useDispatch(), []);
  const profile = useSelector(state => state.profile);
  const [status, setStatus] = useState(profile.status);
  const [editMode, setEditMode] = useState(false);
  const [avatarURLHash, setAvatarURLHash] = useState(0);
  
  useEffect(() => {
    setAvatarURLHash(avatarURLHash + 1);
  }, [profile]);

  useEffect(() => {
    setStatus(profile.status);
    // update profile if status has changed
  }, [profile.status]);

  useEffect(()=>{
    return function(){
      if(status !== profile.status){
        dispatch({type: 'FETCH_PROFILE'});
      }
    }
  }, [dispatch, status]);

  // handle status switch changes
  const toggleAvailable = () => {
    dispatch({type: "UPDATE_PROFILE", payload:{status: status?0:1, noUpdate: true}});
    setStatus(status ? 0 : 1);
  }

  const contactInfo = editMode ?
    <ProfileInputFields close={()=>setEditMode(false)} />:(
    <>
      <Typography variant="h4" component='h2'>
        {profile.full_name}
      </Typography>
      <Typography variant='subtitle1'>
        ({profile.email})
      </Typography>
      <Typography variant='body1' align='center'>
        {profile.company || 'No Workplace'},&nbsp;{profile.location || 'No Location'}
        {profile.email !== profile.preferred_contact ? (
        <><br />{profile.preferred_contact || 'No Contact Info'}</> ):(
          null
        )}
      </Typography>
      <Button color='primary' variant='contained'
        onClick={()=>setEditMode(true)}>
          Edit
      </Button>
    </>
  );

  return (
    <div className={classes.body}>
      <LoadingModal />
      <div className={classes.imgWrapper}>
        <img
          src={profile.avatar_url ?
            `${profile.avatar_url}?hash=${avatarURLHash}` :
            '/assets/sampleAvatar.png'
          }
          alt={`${profile.full_name}'s Avatar`}
          className={classes.profilePicture}
        />
      </div>
      {contactInfo}
      <WeekTimeInput />
      <Typography variant="body2" className={classes.switchContainer}>
        <label htmlFor="blockAvailableSwitch">
          { status ? 'Unblock Availability':'Block All Availability' }
        </label>
        <Switch
          id="blockAvailableSwitch"
          checked={status !== 0}
          color="primary"
          onClick={toggleAvailable}
        />
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={()=>dispatch({type: 'LOGOUT'})}
        className={classes.logOutButton}
      >Log Out</Button>
    </div>
  );
}