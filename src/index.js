import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import SongForm from './components/SongForm';
import GigForm from './components/GigForm';
import App from './App';
import dotenv from 'dotenv';
dotenv.config({ silent:true });


ReactDOM.render(
  <Router history={ hashHistory }>
    <Route path="/" component={ App }>
      <IndexRoute component={ LandingPage } />
      <Route path="/dashboard" component={ Dashboard } />
      <Route path="/addsong" component={ SongForm } />
      <Route path="/addgig" component={ GigForm } />
    </Route>
  </Router>,
  document.getElementById('root')
);
