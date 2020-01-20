import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';


export default function ConfirmDialog(props){
    return (
        <Dialog
            /* some boolean value which says if the dialog should be open */
            open={props.open}
            maxWidth="xs"
        >
            {/* I'm passing into props a title and other values to appear */}
            {props.title && <DialogTitle>{props.title}</DialogTitle>}
            {props.content && <DialogContent>{props.content}</DialogContent>}
            <DialogActions>
                {/* props.onCancel and props.onConfirm
                 is a function passed from the parent component */}
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