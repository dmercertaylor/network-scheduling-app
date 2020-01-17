import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import UserCard from '../UserCard/UserCard';
import Typography from '@material-ui/core/Typography';
import {useTheme, makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    body: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        marginTop: '24px'
    },
    errorMessage: {
        textAlign: 'center',
        margin: '16px'
    }
}));

export default function AvailablePage(){
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useCallback(useDispatch(), []);
    const profile = useSelector(state => state.profile);
    useEffect(()=>{
        if(profile.status === 0){
            dispatch({type: 'FETCH_MATCHED_TIMES'});
        }
    }, [dispatch, profile]);
    const matched = useSelector(state => state.matched);

    return (
        <div className={classes.body}>
            {profile.status !== 0 && 
                <div className={classes.errorMessage}>
                    <Typography component='h2' variant='h5' paragraph>
                        You're Unavailable!
                    </Typography>
                    <Typography variant='body1' paragraph align='center'>
                        Unblock availability from your profile page to see who you can meet with!
                    </Typography>
                </div>
            }
            {profile.status === 0 && matched.map((profile, i) => (
                <React.Fragment key={i}>
                    <UserCard profile={profile} showTimesAvailable />
                </React.Fragment>
            ))}
        </div>
    )
}