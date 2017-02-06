import React, { Component } from 'react';

import { firebase } from '../utils/firebase';

class FBLoginBtn extends Component {
  handleClick(e) {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider);

  }

  render() {
    return (
      <div className="login-btn">
      <button onClick={ this.handleClick.bind(this) }
        className="btn btn-primary">Log in with Facebook
      </button>
      </div>
    )
  }
}

export default FBLoginBtn;
