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

    //TESTING UMBELMANIA CHALLENGE ON A BACK END SERVER
let gamestate_training = "https://umbelmania.umbel.com/training/";
var newval;
let moves = jQuery.get("https://umbelmania.umbel.com/moves/", (data)=>{
  console.log('moves: ',data);
});


let $move = jQuery.post(gamestate_training,(val)=>{
  console.log('response: ',val);
  val["move"]="B";
  newval = val;
  console.log('newval: ',newval);
  let $nextmove= jQuery.post(gamestate_training,newval).done((val)=>{
    console.log('newval in next move: ',newval);
    console.log('next response: ',val);
  });
});
//
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
