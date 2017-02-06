import React, { Component } from 'react';
import { firebase } from '../utils/firebase';

class LogoutButton extends Component {
  handleClick(e) {
    e.preventDefault();
    firebase.auth().signOut();
  }

  render() {
    return (
      <div
        className="logout-div" onClick={ this.handleClick.bind(this) }>{ this.props.children }</div>
    )
  }
}

export default LogoutButton;
