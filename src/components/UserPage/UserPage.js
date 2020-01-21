import React, {useState, useEffect, useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WeekTimeInput from './WeekTimeInput';
import { makeStyles, useTheme, Typography, Switch, Button } from '@material-ui/core';

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
  logOutButton: {
    marginBottom: '16px'
  },
  contactInfo: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    gridTemplateColumns: 'auto max-content',
    fontSize: "1rem"
  },
  textRight: {
    textAlign: 'right'
  },
  spanTwo: {
    gridColumn: 'span 2'
  }
}));

export default function UserPage(){
  const theme = useTheme();
  const classes = useStyle(theme);
  
  const displayKeys = ['full_name', 'company', 'location'];
  const dispatch = useCallback(useDispatch(), []);
  const profile = useSelector(state => state.profile);
  const [status, setStatus] = useState(profile.status);
  
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
  }, [dispatch, status, profile.status]);

  // handle status switch changes
  const toggleAvailable = () => {
    dispatch({type: "UPDATE_PROFILE", payload:{status: status?0:1, noUpdate: true}});
    setStatus(status ? 0 : 1);
  }

  // Convert object keys to actually displayable text
  const ContactInfo = Object.keys(profile).filter(k => displayKeys.includes(k)).map((k, i) => {
    return (
      <React.Fragment key={i}>
        <div className={classes.textRight}>
          {k.replace(/_/g, ' ').replace(/(^|\s)[a-z]/g, (x) => x.toUpperCase())}
          &nbsp;:
        </div>
        <div>&nbsp;{profile[k]}</div>
      </React.Fragment>
    )
  });

  return (
    <div className={classes.body}>
      <img
        src={profile.avatar_url || '/assets/sampleAvatar.png'}
        alt={`${profile.full_name}'s Avatar`}
        className={classes.profilePicture}
      />
      <Typography variant="h4" component='h2'>
        {profile.full_name}
      </Typography>
      <div className={classes.contactInfo}>
        {ContactInfo}
        {profile.email && (
          <>
            <div className={classes.textRight}>Email&nbsp;:</div>
            <div>&nbsp;{profile.email}</div>
          </>
        )}
        {profile.preferred_contact && (
          <>
            <div className={classes.textRight}>Contact&nbsp;:</div>
            <div>&nbsp;{profile.preferred_contact}</div>
          </>
        )}
      </div>
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