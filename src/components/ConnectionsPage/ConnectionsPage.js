import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import UserCard from '../UserCard/UserCard';
import { Typography, useTheme, makeStyles, Paper,
    Button, InputBase, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
    body: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        maxWidth: '100%',
        margin: '16px auto'
    },
    sectionHeader: {
        alignSelf: 'flex-start',
        marginLeft: '16px'
    },
    searchContainer: {
        width: '90%',
        maxWidth: '24rem',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px'
    },
    searchTermDisplay: {
        margin: '16px',
        padding: '8px'
    }
}))

export default function ConnectionsPage(){
    const connections = useSelector(state => state.connections);
    const dispatch = useCallback(useDispatch(), []);
    const theme = useTheme();
    const classes = useStyles(theme);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchEntered, setSearchEntered] = useState(false);
    const searchResults = useSelector(state => state.searchResults);

    useEffect(()=>{
        dispatch({
            type: 'SET_SEARCH_RESULTS',
            payload: {
                results: [],
                searchTerm: ''
            }
        });
    }, []);

    useEffect(()=>{
        dispatch({type: 'FETCH_CONNECTIONS'});
    }, [dispatch]);

    const onSearch = e => {
        e.stopPropagation();
        e.preventDefault();
        if(!searchTerm){
            setSearchEntered(false);
            return;
        };
        dispatch({
            type: 'FETCH_SEARCH',
            payload: {
                searchTerm: searchTerm,
                query: {
                    myConnections: true
                }
            }
        });
        setSearchEntered(true);
    }

    const arrs = [[],[],[]];

    if(searchEntered && searchResults.results) {
        for(let profile of searchResults.results){
            console.log(profile);
            arrs[profile.pending].push(profile);
        }
    } else {
        for(let profile of connections){
            arrs[profile.pending].push(profile);
        }
    }

    const clearSearch = () => {
        setSearchEntered(false);
        setSearchTerm('');
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
        showRemove showContact showLastMet />
    );

    return(
        <div className={classes.body}>
            <Paper
                component="form"
                className={classes.searchContainer}
                onSubmit={onSearch}
            >
                <InputBase
                    placeholder="Search Connections"
                    inputProps={{'aria-label': 'search connections'}}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <IconButton type="submit">
                    <SearchIcon />
                </IconButton>
                {searchTerm && 
                    <IconButton onClick={clearSearch}>
                        <ClearIcon />
                    </IconButton>
                }
            </Paper>
            {searchEntered && searchResults.searchTerm && (
                <Typography  className={classes.searchTermDisplay} 
                    variant='h5' component='h2' align='center'
                >
                    Showing results for {searchResults.searchTerm}
                    <br /><Button onClick={clearSearch}>Clear</Button>
                </Typography>
            )}
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