import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
        width: '100%',
        maxWidth: '100%',
        marginTop: '24px'
    },
    errorMessage: {
        textAlign: 'center',
        margin: '16px'
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
}));

export default function AvailablePage(){
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useCallback(useDispatch(), []);
    const profile = useSelector(state => state.profile);
    const [searchEntered, setSearchEntered] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const searchResults = useSelector(state => state.searchResults);
    const matched = useSelector(state => state.matched);

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
        if(profile.status === 0){
            dispatch({type: 'FETCH_MATCHED_TIMES'});
        }
    }, [dispatch, profile]);

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
                    available: true
                }
            }
        });
        setSearchEntered(true);
    }

    const clearSearch = () => {
        setSearchEntered(false);
        setSearchTerm('');
    }

    const arrayToMap = searchEntered ? searchResults.results : matched;

    return (
        <div className={classes.body}>
            <Paper
                component="form"
                className={classes.searchContainer}
                onSubmit={onSearch}
            >
                <InputBase
                    placeholder="Search Available"
                    inputProps={{'aria-label': 'search available'}}
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
            {profile.status === 0 && arrayToMap.map((profile, i) => (
                <React.Fragment key={i}>
                    <UserCard profile={profile} showTimesAvailable showContact showLastMet showSkip />
                </React.Fragment>
            ))}
        </div>
    )
}