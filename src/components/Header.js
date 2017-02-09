import React, { Component } from 'react';
import {firebase} from '../utils/firebase';
import NavLink from './NavLink';
import LogoutButton from './LogoutButton';

class Header extends Component {

  sessionButton() {
    if (firebase.auth().currentUser) {
      return <LogoutButton>Logout</LogoutButton>;
    }
  }
  render(){
    return(
      <header>
        <div className="title">Fat Giggler</div>
        <ul className="main_nav">

          <li><NavLink to="/" onlyActiveOnIndex>{this.sessionButton()}</NavLink></li>
          <li><NavLink to="/dashboard"><a href="#">Now Playing</a></NavLink></li>
          <li><NavLink to="/addgig"><a href="#">Add Gig</a></NavLink></li>
          <li><NavLink to="/addsong"><a href="#">Add Song</a></NavLink></li>
          <li><a href="#">Songs</a></li>
          <li><NavLink to="/gigs"><a href="#">Gigs</a></NavLink></li>

        </ul>
      </header>
    );
  }
}

export default Header;
