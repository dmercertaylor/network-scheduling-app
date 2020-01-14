import React, {useState} from 'react';
import { useTheme } from '@material-ui/core/styles';
import Avatar from 'react-avatar-edit';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export default function AvatarUpload(props){

    const [preview, setPreview] = useState('/assets/sampleAvatar.png');
    const [modalOpen, setModalOpen] = useState(false);
    const theme = useTheme();
    const avatarSize = 132;
    const previewStyle = {
        backgroundImage: `url(${preview})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: avatarSize,
        height: avatarSize,
        margin: '8px'
    }

    const bodyStyle = {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        margin: '16px'
    }

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }

    const onClose = () => {
        setModalOpen(false);
        props.onClose(preview);
    }

    const onBeforeFileLoad = (elem) => {
        if(elem.target.files[0].size > 1500000){
            alert("Image size too large");
            elem.target.value = "";
        }
    }

    return(
        <div style={bodyStyle}>
            <Button
                variant='contained'
                color="primary"
                onClick={()=>setModalOpen(true)}
            >
                Add Profile Image
            </Button>
            <Modal
                open={modalOpen}
                onBackdropClick={onClose}
            >
                <Paper style={modalStyle} >
                    <Avatar
                        backgroundColor={theme.palette.background.paper}
                        height={300}
                        onBeforeFileLoad={onBeforeFileLoad}
                        onCrop={img => setPreview(img)}
                        onClose={onClose}
                    />
                </Paper>
            </Modal>
            <div style={previewStyle} id="avatar-input-helper" />
            <Typography
                style={{width: avatarSize + 32}}
                component='p'
                variant='caption'
                id="avatar-input-helper"
            >
                Images must be no more than 1.5mb
            </Typography>
        </div>
    )
}