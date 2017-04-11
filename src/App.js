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
      playing:'hello',
      isonline:false
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      let uid=0;
      if(user){
        // console.log('user: ',user);
        this.setState({
          uid:user.uid,
          isonline:true
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
            if(result){
              this.setState({
                playing:result,
                uid:uid
              });
            }else{
              this.setState({
                playing:result,
                uid:uid
              });
            }

          });
        this.setState({
          userpic:user.photoURL
        });
        firebase.database()
        .ref('/users/loggedin/'+uid)
        // .set({
        //   name:user.displayName,
        //   photo:user.photoURL,
        //   online:'true'
        // });
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
    let uid = this.state.uid;
    let playing = this.state.playing;
    let isonline = this.state.isonline;
    let children = (uid) ? React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, {
        playing:playing,
        uid:uid
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
