import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles( theme => ({
  navTitle: {
    textAlign: 'center',
    fontSize: "2rem",
    display: "inline-block",
    color: theme.palette.text.primary,
    cursor: 'pointer',
    padding: '6vh'
  },
  nav: {
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
  },
  navLink: {
    color: theme.palette.text.primary,
    margin: '0px 1rem',
    textDecoration: 'none',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    outline: 0, 
    '&:hover':{
      textDecoration: 'underline'
    }
  },
  navRight: {
    float: 'right'
  }
}));

export default function Nav(props){
  const user = useSelector(state => state.user);
  const theme = useTheme();
  const classes = useStyles(theme);
  if( !user.id ){
    return (
      <div className={classes.nav}>
        <h2 className={classes.navTitle}>Scheduler</h2>
      </div>
    );
  } else {
    return (
      <div>
        
      </div>
    )
  }
}
