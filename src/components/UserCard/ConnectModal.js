import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import { Card, CardMedia, makeStyles, useTheme, Typography, 
    Button, Modal, TextField} from '@material-ui/core';
import UserCard from './UserCard';

const useStyles = makeStyles(theme => ({
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
    metInput: {
        margin: 16
    },
    noWrap: {
        whiteSpace: 'nowrap'
    }
}))

export default function ConnectModal(props){
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