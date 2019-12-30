import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import SongForm from './components/SongForm';
import GigForm from './components/GigForm';
import Gigs from './components/Gigs';
import Songs from './components/Songs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Community from './components/Community';
import App from './App';
import dotenv from 'dotenv';
dotenv.config({ silent:true });


ReactDOM.render(
  <MuiThemeProvider>
  <Router history={ hashHistory }>
    <Route path="/" component={ App }>
      <IndexRoute component={ Gigs } />
      <Route path="/dashboard" component={ Dashboard } />
      <Route path="/addsong" component={ SongForm } />
      <Route path="/addgig" component={ GigForm } />
      <Route path="/gigs" component={ Gigs } />
      <Route path="/songs" component={ Songs } />
      <Route path="/community" component={ Community } />
    </Route>
  </Router>
</MuiThemeProvider>,
  document.getElementById('root')
);
