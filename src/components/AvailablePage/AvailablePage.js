import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

export default function AvailablePage(){
    const dispatch = useCallback(useDispatch(), []);
    useEffect(()=>{
        dispatch({type: 'FETCH_MATCHED_TIMES'});
    }, [dispatch]);
    const matched = useSelector(state => state.matched);

    return (
        <div>
            {JSON.stringify(matched)}
        </div>
    )
}