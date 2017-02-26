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
      user: {},
      playing:'hello'
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
        let name = user.displayName;
        console.log('uid: ',uid);
        // console.log('app user: ',user.photoURL);
        firebase.database()
          .ref('/users/'+uid+'/playing/')
          .on('value',(data)=>{
            let result = data.val();
            // console.log('now actually playing: ',result);
            this.setState({
              playing:result
            });
          });
        this.setState({
          userpic:user.photoURL
        });
        firebase.database()
        .ref('/users/loggedin/'+uid)
        .set({
          online:'true',
          name:name
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
    let playing = this.state.playing;
    let children = (playing) ? React.Children.map(this.props.children, function (child) {
    return React.cloneElement(child, {
      playing:playing
    })
  }) : this.props.children;
    return (
      <div>
        <Header pic = {this.state.userpic} />
        { children || <LandingPage />}
        <Footer />
      </div>
    );
  }
}

export default App;
