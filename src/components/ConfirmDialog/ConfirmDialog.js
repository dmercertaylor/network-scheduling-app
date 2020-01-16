import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export default function ConfirmDialog(props){
    return (
        <Dialog
            open={props.open}
            maxWidth="xs"
        >
            {props.title && <DialogTitle>{props.title}</DialogTitle>}
            <DialogActions>
                <Button autoFocus onClick={props.onCancel} color="primary">
                    {props.cancelText || 'Cancel'}
                </Button>
                <Button onClick={props.onConfirm} color="primary">
                    {props.confirmText || 'Ok'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}