import React from 'react'
import {useSelector} from 'react-redux';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function LoadingModal(){

    const loading = useSelector(state => state.loading);

    const style = {
        position: 'absolute',
        top: '45%',
        left: '40vw',
        width: '20vw',
        height: '20vw',
        outline: 0
    };

    const modalStyle = {
        outline: 0
    };

    return(
        <Modal open={loading} style={modalStyle}>
            <CircularProgress style={style} />
        </Modal>
    );
}