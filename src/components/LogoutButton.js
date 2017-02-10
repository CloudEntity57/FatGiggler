import React, { Component } from 'react';
import { firebase } from '../utils/firebase';
import { hashHistory } from 'react-router';

class LogoutButton extends Component {
  // componentWillMount(){
  //
  // }
  handleClick(e) {
    e.preventDefault();
    let uid=0;
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        // console.log('user: ',user);
        this.setState({
          uid:user.uid
          // userpic:user.photoURL
        });
        uid=user.uid;

        let target = firebase.database()
        .ref('/users/loggedin/user');
        console.log('target: ',target);
        hashHistory.push('/dashboard');
      }
    });


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
