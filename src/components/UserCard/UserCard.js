import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import { Card, CardMedia, makeStyles, useTheme, Typography, 
    Button, Modal, TextField} from '@material-ui/core';

import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

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
        gridTemplateColumns: 'max-content 8rem',
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
        border: '2px solid ' + theme.palette.text.primary,
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
                        Cancel
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
    const {profile, showConnect, showContact, showRemove} = props;
    const [openModal, setOpenModal] = useState(false);
    const [confirmRemoveDialogOpen, setConfirmRemoveDialogOpen] = useState(false);
    const dispatch = useDispatch();
    let connectButton;

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
                {!showRemove && connectButton}
            </div>
            {showRemove && (
                <>
                    <Button
                        onClick={()=>setConfirmRemoveDialogOpen(true)}
                        variant='contained'
                        color='secondary'
                    >Remove</Button>
                    <ConfirmDialog open={confirmRemoveDialogOpen}
                    title={`Remove ${profile.full_name}?`}
                    onCancel={()=>setConfirmRemoveDialogOpen(false)}
                    onConfirm={removeConnection} />
                </>
            )}
            {showRemove && connectButton}
            <div>
                {showContact && profile.preferred_contact && (
                    <Typography variant="body1" align='center'>
                        Contact via {profile.preferred_contact}
                    </Typography>
                )}
            </div>
        </Card>
    )
}