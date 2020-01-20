import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { Card, CardMedia, makeStyles, useTheme, Typography, 
    Button} from '@material-ui/core';

import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ConnectModal from './ConnectModal';
import {DatePicker} from '@material-ui/pickers';

import days from '../../modules/days';
import formatTime from '../../modules/formatTime';

const useStyles = makeStyles(theme => ({
    noWrap: {
        whiteSpace: 'nowrap'
    },
    card: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gridRowGap: '8px',
        gridColumnGap: '8px',
        padding: '16px',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        width: '95%',
        maxWidth: 340,
    },
    cardContent: {
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'center',
        overflow: 'wrap'
    },
    avatar: {
        width: '30vw',
        height: '30vw',
        maxWidth: '128px',
        maxHeight: '128px',
        backgroundSize: 'cover',
        borderRadius: '50%',
        border: '2px solid ' + theme.palette.text.primary,
    }
}));


function TimesAvailable(props){
    const times = props.profile.times;
    const strings = [
        undefined, undefined, undefined, undefined,
        undefined, undefined, undefined
    ];
    times.forEach(({start_time, end_time, week_day}) => {
        if(strings[week_day]){
            strings[week_day] += `, ${formatTime(start_time)} - ${formatTime(end_time)}`;
        } else {
            strings[week_day] = `${days[week_day]}: ${formatTime(start_time)} - ${formatTime(end_time)}`;
        }
    });
    return (
        <>
        {strings.filter(a => !!a).map((string, i) => (
            <Typography key={i} variant='body1'>
                {string}
            </Typography>
        ))}
        </>
    )
}

export default function UserCard(props){
    const theme = useTheme();
    const classes = useStyles(theme);
    const {profile, showConnect, showContact,
        showRemove, showTimesAvailable, showLastMet, showSkip} = props;
    const [openModal, setOpenModal] = useState(false);
    const [confirmRemoveDialogOpen, setConfirmRemoveDialogOpen] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const dispatch = useDispatch();
    let connectButton;

    useEffect(()=>{
        profile.last_met = new Date(profile.last_met);
    }, [profile]);

    const removeConnection = () => {
        setConfirmRemoveDialogOpen(false);
        dispatch({
            type: 'REMOVE_CONNECTION',
            payload: profile.id
        });
    }
    
    const acceptConnection = () => {
        dispatch({
            type: 'ACCEPT_CONNECTION',
            payload: profile.id
        })
    }

    const submitNewMeetingDate = (date) => {
        dispatch({
            type: 'ADD_MEETING',
            payload: {friend_id: profile.id, date}
        });
        dispatch({ type: 'FETCH_MATCHED_TIMES' });
        setDatePickerOpen(false);
    }

    const skipMeeting = () => {
        dispatch({type: 'ADD_SKIP', payload: {friend_id: profile.id} } );
        dispatch({type: 'FETCH_MATCHED_TIMES'});
    }
    
    if(showConnect){
        if( !profile.connected && !profile.pending ){
            connectButton = (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>setOpenModal(true)}
                >
                    Connect
                </Button>
            );
        } else if (profile.pending === 1){
            connectButton = (
                <Typography variant='body1'>
                    Connection Sent
                </Typography>
            );
        } else if (profile.pending === 2){
            connectButton = (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={acceptConnection}
                >
                    Connect
                </Button>
            );
        } else if (profile.connected){
            connectButton = (
                <Typography variant='body1'>
                    Connected
                </Typography>
            );
        }
    }

    return (
        <Card className={classes.card}>
            {showConnect &&
                <ConnectModal
                    profile={profile}
                    open={openModal}
                    close={()=>setOpenModal(false)}
            />}
            <CardMedia
                image={profile.avatar_url || '/assets/sampleAvatar.png'}
                className={classes.avatar}
            />
            <div className={classes.cardContent}>
                <Typography variant="h5" component="h4" align='left'>
                    {profile.full_name}
                </Typography>
                <Typography variant="body1" align='left'>
                    <span className={classes.noWrap}>
                        {profile.company}
                        {profile.company && ','}
                    </span> <span className={classes.noWrap}>
                        {profile.location}
                    </span>
                </Typography>
                {profile.met_at &&
                    <Typography variant='body1'>
                        Met at {profile.met_at}
                    </Typography>}
                {showLastMet &&
                    <Typography variant='body1'>
                        {profile.last_met ?
                            `Last met ${new Date(profile.last_met).toLocaleDateString("en-US")}` :
                            `No past meetings`}
                    </Typography>
                }
                {showContact && profile.preferred_contact && (
                    <Typography variant="body1">
                        Contact via <span className={classes.noWrap}>{profile.preferred_contact}</span>
                    </Typography>
                )}
                {!showRemove && showConnect && connectButton}
            </div>
            {showRemove && (
                <>
                    <Button
                        onClick={()=>setConfirmRemoveDialogOpen(true)}
                        variant='contained'
                        color='secondary'
                    >Remove</Button>
                    <ConfirmDialog
                        open={confirmRemoveDialogOpen}
                        title={`Remove ${profile.full_name}?`}
                        onCancel={()=>setConfirmRemoveDialogOpen(false)}
                        onConfirm={removeConnection}
                    />
                </>
            )}
            {showRemove && showConnect && connectButton}
            {showSkip && (
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={skipMeeting}
                >
                    Skip
                </Button>
            )}
            {showLastMet && (
                <div>
                    <Button
                        onClick = {()=>setDatePickerOpen(true)}
                        variant='contained'
                        color = 'primary'
                        fullWidth
                    >
                        Mark&nbsp;met
                    </Button>
                    <DatePicker
                        style={{display: 'none'}}
                        open={datePickerOpen}
                        disableFuture
                        onChange={submitNewMeetingDate}
                        onClose={()=>setDatePickerOpen(false)}
                        hidden
                    />
                </div>
            )}
            <div style={showTimesAvailable ? {gridColumnStart: 'span 2'}:{}}>
                {showTimesAvailable && 
                    <TimesAvailable profile={profile} />
                }
            </div>
        </Card>
    )
}