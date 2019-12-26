import React, { Component } from 'react';

import { firebase } from '../utils/firebase';

class GoogleLoginBtn extends Component {
  handleClick(e) {
    e.preventDefault();
      const provider = new firebase.auth.GoogleAuthProvider();
      console.log('provider - ',provider)
      firebase.auth().signInWithPopup(provider).catch((err) => console.log('err!! - ',err));
  }

  render() {
    return (
      <div className="login-btn">
      <button onClick={ this.handleClick.bind(this) }
        className="btn btn-danger">Log in with Google
      </button>
      </div>
    )
  }
}

export default GoogleLoginBtn;
