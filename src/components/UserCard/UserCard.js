import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import { Card, CardMedia, CardContent,
    makeStyles, useTheme, Typography, 
    Button, Modal, Paper, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    noWrap: {
        whiteSpace: 'nowrap'
    },
    modalPaper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexFlow: 'column nowrap',
        maxWidth: '100vw',
        padding: '16px 8px',
        backgroundColor: theme.palette.background.default
    },
    modalButtons: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between'
    },
    card: {
        display: 'grid',
        gridTemplateColumns: 'max-content auto',
        padding: '16px',
        alignItems: 'space-between',
        justifyContent: 'start',
        marginBottom: '16px',
        width: '95%',
        maxWidth: 340,
    },
    cardContent: {
        padding: '8px !important',
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'center',
        overflow: 'wrap'
    },
    metInput: {
        margin: 16
    },
    avatar: {
        width: '30vw',
        height: '30vw',
        maxWidth: '128px',
        maxHeight: '128px',
        backgroundSize: 'cover',
        borderRadius: '50%',
        border: '2px solid ' + theme.palette.text.primary
    }
}));

function ConnectModal(props){
    const theme = useTheme();
    const classes = useStyles(theme);
    const [metAt, setMetAt] = useState('');
    const dispatch = useDispatch();
    const {profile, open, close} = props;
    const onClose = () => {
        setMetAt('');
        close();
    }
    const onConnect = () => {
        dispatch({
            type: 'MAKE_CONNECTION',
            payload: {met_at: metAt, friend_id: profile.id}
        });
        setMetAt('');
        close();
    }
    return (
        <Modal open={open} className={classes.modal} onBackdropClick={onClose}>
            <div className={classes.modalPaper}>
                <UserCard profile={profile} />
                <div className={classes.metInput}>
                    <Typography
                        className={classes.noWrap}
                        variant='body1'
                        component='label'
                        htmlFor="met-at-input"
                    >
                        Met At:
                    </Typography>
                    <TextField
                        id="met-at-input"
                        helperText={
                            `Indicate the event or location where you met ${profile.full_name}`
                        }
                        autoFocus
                        value={metAt}
                        onChange={e=>setMetAt(e.target.value)}
                    />
                </div>
                <div className={classes.modalButtons}>
                    <Button
                        variant='contained'
                        color='secondary'
                        onClick={onClose}
                    >
                        Cancle
                    </Button>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={onConnect}
                    >
                        Connect
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default function UserCard(props){
    const theme = useTheme();
    const classes = useStyles(theme);
    const {profile, showConnect, showContact} = props;
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    let connectButton;
    
    const acceptConnection = () => {
        dispatch({
            type: 'ACCEPT_CONNECTION',
            payload: profile.id
        })
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
                    Connect Back
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
                        {profile.company},&nbsp;
                    </span>
                    <span className={classes.noWrap}>
                        {profile.location}
                    </span>
                </Typography>
                {showContact && (
                    <Typography variant="body2" align='left'>
                        {profile.preferred_contact}
                    </Typography>
                )}
                {connectButton}
            </div>
        </Card>
    )
}