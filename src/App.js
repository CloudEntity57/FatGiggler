import React, { Component } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import { firebase, firebaseListToArray } from './utils/firebase';
import { hashHistory } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('app user: ',user.photoURL);
        this.setState({
          userpic:user.photoURL
        });
        hashHistory.push('/dashboard');
      } else {
        this.setState({
          user: {},
          userpic:''
        });
      }
    });

  }
  // componentWillUpdate(){
  // //     firebase.auth().signOut().then(function() {
  // //     console.log('signed out');
  // //     this.setState({
  // //       userpic:''
  // //     });
  // //   }, function(error) {
  // //     // An error happened.
  // //   });
  //   firebase.auth().onAuthStateChanged(user => {
  //       if (!user) {
  //         this.setState({
  //              userpic:''
  //         });
  //       }
  //   });
  //
  // }

  render() {
    return (
      <div>
        <Header pic = {this.state.userpic} />
        { this.props.children || <LandingPage />}
        <Footer />
      </div>
    );
  }
}

export default App;
