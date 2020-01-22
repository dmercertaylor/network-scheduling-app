import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppBar, Tabs, Tab} from '@material-ui/core';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import RecentActorsIcon from '@material-ui/icons/RecentActors';

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
  }
}));

export default function Nav(props){
  const user = useSelector(state => state.user);
  const location = useLocation();
  const theme = useTheme();
  const classes = useStyles(theme);

  // set active tab to the right place
  let curIndex = ['/home', '/search', '/connections', '/available'].indexOf(location.pathname);
  if(curIndex === -1) curIndex = 0;
  const [activeTab, setActiveTab] = useState(curIndex);

  // return if not logged in
  if( !user.id ){
    return (
      <div className={classes.nav}>
        <h2 className={classes.navTitle}>Scheduler</h2>
      </div>
    );
  }


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <AppBar position="static" color="default">
      <Tabs
        value={activeTab}
        onChange = {(e, v)=>setActiveTab(v)}
        variant="fullWidth"
      >
        <Tab aria-label="Profile" icon={<AccountCircleIcon />} value={0} href="#home" {...a11yProps(0)} />
        <Tab aria-label="User Search" icon={<SearchIcon />} value={1} href="#search" {...a11yProps(1)} />
        <Tab aria-label="Connections" icon={<HowToRegIcon />} value={2} href="#connections" {...a11yProps(2)} />
        <Tab aria-label="Available" icon={<RecentActorsIcon />} value={3} href="#available" {...a11yProps(3)} />
      </Tabs>
    </AppBar>
  );
}
