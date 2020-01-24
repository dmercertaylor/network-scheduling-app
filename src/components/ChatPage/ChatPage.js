import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

export default function(props){
    const dispatch = useSelector(useDispatch(), []);
    const user_id = useSelector(state => state.user.user_id);
    const friend_id = useParams();
    const existingMessages = useSelector(messages);

    useEffect(()=>{
        dispatch({
            type: 'FETCH_MESSAGES',
            payload: { friend_id }
        })
    }, [dispatch]);
    return (
        <div>

        </div>
    )
}