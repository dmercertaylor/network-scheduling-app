import React, { useState, useEffect, useRef } from 'react';
import {useSelector} from 'react-redux';
import { useTheme, Paper, Typography, makeStyles } from '@material-ui/core';
// material-ui does not support vendor prefixes correctly,
// so unfortunately, this is necessary
import './unselectable.css';

const times = [];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

for(let i = 7; i < 24; i++){
    times.push(`${i}:00`);
    times.push(`${i}:30`);
}

const useStyles = makeStyles(theme => ({
    body: {
        padding: '16px'
    },
    timeRow: {
        display: 'flex',
        flexFlow: 'row nowrap',
        touchAction: 'none'
    },
    timeBox: {
        maxWidth: '100vw',
        overflowX: 'scroll',
        display: 'grid',
        gridTemplateColumns: '4rem auto',
        maxHeight: '16rem',
        overflow: 'scroll'
    },
    timeActive: {
        width: '3rem',
        backgroundColor: 'gold',
        borderBottom: '1px solid gray'
    },
    timeNotActive: {
        width: '3rem'
    }
}));

export default function WeekTimeInput(props){
    const theme = useTheme();
    const classes = useStyles(theme);
    const profile = useSelector(state => state.profile);

    // multidimensional array: times[time][dayIndex]
    const [timesAvailable, setTimesAvailable] = useState([]);
    const [mouseMode, setMouseMode] = useState(false);
    const timeBoxRef = useRef();

    // Insert existing times onto table
    useEffect(() =>{
        const newTimes = [];
        for(let i=0; i<times.length; i++){
            newTimes.push([false, false, false, false, false, false, false]);
        }

        profile.timesAvailable && profile.timesAvailable.forEach(time => {
            // trim start zero, and set to 30 minute intervals (excuse the length)
            const start = time.start_time.replace(/^0/, '').replace(/:\d\d$/, '').replace(/(:[0-9][1-9])|(:[1-9][0-9])/, ':30');
            const end = time.end_time.replace(/^0/, '').replace(/:\d\d$/, '').replace(/(:[0-9][1-9])|(:[1-9][0-9])/, ':30');

            for(let i = times.indexOf(start); times[i] !== end && i < times.length; i++){
                newTimes[i][time.week_day] = true;
            }
        });
        console.log(newTimes);
        setTimesAvailable(newTimes);
    }, [profile]);

    const flipTimeAvailable = (dayIndex, timeIndex, forceSet) => {
        const newTimes = [...timesAvailable];
        newTimes[timeIndex][dayIndex] = (mouseMode === 'add' || forceSet);
        setTimesAvailable(newTimes);
    }

    const boxes = times.map((time, tIndex) => {
        const onPointerDown = (day, time) => {
            if(timesAvailable[time][day]){
                setMouseMode('delete');
                flipTimeAvailable(day, time);
            } else {
                setMouseMode('add');
                flipTimeAvailable(day, time, true);
            }
        }
        return (
            <React.Fragment key={tIndex}>
                <div className="unselectable" onSelect={null}>
                    {time}
                </div>
                <div className={classes.timeRow}>
                    {days.map((day, dIndex)=>(
                        <div id = {`timeSelection${tIndex}${dIndex}`}
                            key={tIndex + dIndex}
                            onPointerEnter={e => {e.preventDefault(); mouseMode && flipTimeAvailable(dIndex, tIndex);}}
                            onPointerDown={e=>{
                                document.getElementById(`timeSelection${tIndex}${dIndex}`)
                                    .releasePointerCapture(e.pointerId);
                                onPointerDown(dIndex, tIndex);
                            }}
                            className={(timesAvailable[tIndex] && timesAvailable[tIndex][dIndex]) ?
                                classes.timeActive : classes.timeNotActive}
                        >
                        </div>
                    ))}
                </div>
            </React.Fragment>
        );
    });

    return (
        <Paper
            elevation={2}
            onPointerUp={() => setMouseMode(false) }
            onPointerLeave={()=>setMouseMode(false)}
            className={classes.body}
        >
            <Typography variant='h5' component='h3'>
                Set Availability
            </Typography>
            <div className={classes.timeBox} ref={timeBoxRef}>
                {boxes}
            </div>
        </Paper>
    )
}