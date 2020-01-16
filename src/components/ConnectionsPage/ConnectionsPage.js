import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import UserCard from '../UserCard/UserCard';
import { Typography, useTheme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    body: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        width: 'max-content',
        maxWidth: '100%',
        margin: '16px auto'
    },
    sectionHeader: {
        alignSelf: 'flex-start',
        marginLeft: '16px'
    }
}))

export default function ConnectionsPage(){
    const connections = useSelector(state => state.connections);
    const dispatch = useCallback(useDispatch(), []);
    const theme = useTheme();
    const classes = useStyles(theme);

    useEffect(()=>{
        dispatch({type: 'FETCH_CONNECTIONS'});
    }, [dispatch])

    const arrs = [[],[],[]];
    for(let profile of connections){
        arrs[profile.pending].push(profile);
    }

    const awaiting = arrs[2].map((profile, i) => 
        <UserCard key={i} profile={profile}
            showConnect showRemove />
    );

    const sent = arrs[1].map((profile, i) => 
        <UserCard key={i} profile={profile}
            showConnect showRemove />
    );

    const connected = arrs[0].map((profile, i) => 
        <UserCard key={i} profile={profile}
        showRemove showContact />
    );

    return(
        <div className={classes.body}>
            {sent.length ? (
                <Typography variant='h5' component='h2' paragraph
                className={classes.sectionHeader}>
                    Sent Requests:
                </Typography> ):''}
            {sent}
            {awaiting.length ? (
                <Typography variant='h5' component='h2' paragraph
                className={classes.sectionHeader}>
                    Incoming Requests:
                </Typography> ):''}
            {awaiting}
            {connected.length ? (
                <Typography variant='h5' component='h2' paragraph
                className={classes.sectionHeader}>
                    Connections:
                </Typography> ):''}
            {connected}
        </div>
    );
}