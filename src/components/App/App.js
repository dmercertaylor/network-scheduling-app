import React, {useState, useEffect, useCallback} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {useDispatch} from 'react-redux';


import { MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Nav from '../Nav/Nav';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

import UserPage from '../UserPage/UserPage';
import SearchPage from '../SearchPage/SearchPage';
import ConnectionsPage from '../ConnectionsPage/ConnectionsPage';

export default function App(){
  // useCallback ensures dispatch has
  // a constant address, since it may
  // move around otherwise (thereby firing
  // things that have it as a dependency)
  const dispatch = useCallback(useDispatch(), []);

  /* set project theme */
  const [theme, setTheme] = useState({
    palette: {
      type: 'dark'
    }
  });
  const muiTheme = createMuiTheme(theme);

  // dispatch is passed as a dependency here
  // to prevent an eslint warning which may be
  // in error, or change in future releases
  useEffect(()=>{
    dispatch({type: 'FETCH_USER'});
  }, [dispatch]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
            <ProtectedRoute
              exact
              path="/home"
              component={UserPage}
            />
            <ProtectedRoute
              exact path="/search"
              component={SearchPage}
            />
            <ProtectedRoute
              exact path="/connections"
              component={ConnectionsPage}
            />
            {/* This works the same as the other protected route, except that if the user is logged in,
            they will see the info page instead. */}
            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
        </div>
      </Router>
    </MuiThemeProvider>
  )
}
