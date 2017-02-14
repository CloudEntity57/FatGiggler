import React, { Component } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import { firebase, firebaseListToArray } from './utils/firebase';
import { hashHistory } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import jQuery from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      let uid=0;
      if(user){
        // console.log('user: ',user);
        this.setState({
          uid:user.uid
          // userpic:user.photoURL
        });
        uid=user.uid;
        console.log('uid: ',uid);
        // console.log('app user: ',user.photoURL);
        this.setState({
          userpic:user.photoURL
        });
        firebase.database()
        .ref('/users/loggedin')
        .update({
          user:uid
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

  changeColor(){
    console.log('changing');
    jQuery('.body').addClass('landing_content');
  }

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
