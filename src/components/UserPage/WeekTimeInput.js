import React, { useState, useEffect, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useTheme, Paper, Typography, makeStyles, Button } from '@material-ui/core';
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
        padding: '16px',
        margin: '16px'
    },
    gutterBottom: {
        marginBottom: '16px'
    },
    headerFlex: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    timeBox: {
        maxWidth: '90vw',
        overflowX: 'scroll',
        display: 'grid',
        gridTemplateColumns: '3rem auto',
        maxHeight: '16rem',
        overflow: 'scroll',
        fontSize: '1rem',
        "& > :nth-child(4n+1)": {
            backgroundColor: theme.palette.background.paper
        },
        "& > :nth-child(4n)": {
            backgroundColor: '#343434'
        },
        "& > :nth-child(4n-1)": {
            backgroundColor: '#343434'
        }
    },
    timeActive: {
        width: '3rem',
        backgroundColor: 'gold',
        borderBottom: '1px solid gray',
        borderRight: '1px solid gray'
    },
    timeNotActive: {
        width: '3rem',
        textAlign: 'center',
        borderBottom: '1px solid gray',
        borderRight: '1px solid gray'
    }
}));

export default function WeekTimeInput(props){
    const theme = useTheme();
    const profile = useSelector(state => state.profile);
    const dispatch = useDispatch();

    // multidimensional array: times[time][dayIndex]
    const [timesAvailable, setTimesAvailable] = useState([]);
    const [mouseMode, setMouseMode] = useState(false);
    const [headerScroll, setHeaderScroll] = useState(0);
    const [timesScroll, setTimesScroll] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const timeBoxRef = useRef();

    const classes = useStyles(theme);
    // Style for element which needs headerScroll;
    // not consistent in makeStyle yet.
    const timeColStickyStyle = {
        position: 'relative',
        borderBottom: '1px solid gray',
        borderRight: '1px solid gray',
        left: timesScroll - 2,
        textAlign: 'right',
        zIndex: 1600,
    };

    const dayRowStickyStyle = {
        display: 'flex',
        flexFlow: 'row nowrap',
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        zIndex: 1700,
        top: headerScroll - 2
    };

    const dayRowCornerStyle = {
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        zIndex: 1700,
        top: headerScroll - 2
    }

    const timeRow = {
        display: 'flex',
        flexFlow: 'row nowrap',
        touchAction: editMode ? 'none' : 'auto'
    };

    // Scroll table headers to the right place
    const setScroll = e => {
        setHeaderScroll(e.target.scrollTop);
        setTimesScroll(e.target.scrollLeft);
    }

    // Insert existing times onto table
    useEffect(resetTimesAvailable, [profile]);
    function resetTimesAvailable(){
        setEditMode(false);
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
        setTimesAvailable(newTimes);
    }

    // If appropriate, flip time box from on to off
    const flipTimeAvailable = (dayIndex, timeIndex, forceSet) => {
        if(editMode){
            const newTimes = [...timesAvailable];
            newTimes[timeIndex][dayIndex] = (mouseMode === 'add' || forceSet);
            setTimesAvailable(newTimes);
        }
    }

    // create time boxes that can be flipped
    const boxes = times.map((time, tIndex) => {
        const onPointerDown = dIndex => e => {
            if(editMode){
                document.getElementById(`timeSelection${tIndex}${dIndex}`).releasePointerCapture(e.pointerId);
                if(timesAvailable[tIndex][dIndex]){
                    setMouseMode('delete');
                    flipTimeAvailable(dIndex, tIndex);
                } else {
                    setMouseMode('add');
                    flipTimeAvailable(dIndex, tIndex, true);
                }
            } else {
            }
        }

        const onPointerEnter = dIndex => e => {
            if(mouseMode){
                e.preventDefault();
                flipTimeAvailable(dIndex, tIndex);
            }
        }
        return (
            <React.Fragment key={tIndex}>
                <div className="unselectable" style={timeColStickyStyle} onSelect={null}>
                    {time}
                </div>
                <div style={timeRow}>
                    {days.map((day, dIndex)=>(
                        <div id = {`timeSelection${tIndex}${dIndex}`}
                            key={(tIndex + 1) * days.length + dIndex}
                            onPointerEnter={onPointerEnter(dIndex)}
                            onPointerDown={onPointerDown(dIndex)}
                            className={(timesAvailable[tIndex] && timesAvailable[tIndex][dIndex]) ?
                                classes.timeActive : classes.timeNotActive}
                        >
                        </div>
                    ))}
                </div>
            </React.Fragment>
        );
    });
    // save existing edits to db
    const saveEdits = () => {
        setEditMode(false);
        const newTimesAvailable = [];
        // multidimensional array: times[time][dayIndex]
        // const [timesAvailable, setTimesAvailable] = useState([]);
        for(let timeI=0; timeI<timesAvailable.length; timeI++){
            for(let dayI=0; dayI < timesAvailable[timeI].length; dayI++){
                if(timesAvailable[timeI][dayI] &&
                    (timeI === 0 || !timesAvailable[timeI-1][dayI]))
                {
                    // get end time
                    let end;
                    for(end = timeI; timesAvailable[end][dayI]; end++);
                    newTimesAvailable.push({
                        start_time: times[timeI],
                        end_time: times[end],
                        week_day: dayI
                    });
                }
            }
        }
    
        dispatch({type: 'UPDATE_TIMES_AVAILABLE', payload: newTimesAvailable});
    }

    return (
        <Paper
            elevation={2}
            onPointerUp={() => setMouseMode(false) }
            onPointerLeave={()=>setMouseMode(false)}
            className={classes.body}
        >
            <div className={classes.headerFlex}>
                <Typography variant='h5' component='h3' gutterBottom={true}>
                    Free Times:
                </Typography>
                {editMode && (
                    <Button
                        variant="contained"
                        onClick={resetTimesAvailable}
                        className={classes.gutterBottom}
                    >Cancel</Button>
                )}
                <Button
                    variant="contained"
                    color={editMode?"secondary":"primary"}
                    onClick={()=>editMode ? saveEdits() : setEditMode(true)}
                    className={classes.gutterBottom}
                >{editMode?'Save':'Edit'}</Button>
            </div>
            <div
                className={classes.timeBox}
                ref={timeBoxRef}
                onScroll={setScroll}
            >
                <div style={dayRowCornerStyle}></div>
                <div style={dayRowStickyStyle}>
                    {['Su','M','T','W','Th','F','Sa'].map((day, i) => (
                        <div key={i} className={classes.timeNotActive}>{day}</div>
                    ))}
                </div>
                {boxes}
            </div>
        </Paper>
    )
}