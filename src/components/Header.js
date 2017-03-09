import React, { Component } from 'react';
import {firebase, firebaseListToArray} from '../utils/firebase';
import NavLink from './NavLink';
import LogoutButton from './LogoutButton';
import { hashHistory } from 'react-router';

class Header extends Component {
  constructor(props){
    super(props);
    this.state={
      userpic:'',
      clicks:0
    }
  }
componentWillMount(){
  firebase.auth().onAuthStateChanged(
    user => {
      if(user){
        // console.log('header user: ',user);
        this.setState({
          userpic:user.photoURL
          // userpic:user.photoURL
        });
      }
    });

    firebase.database()
    .ref('/users/clicks')
    .on('value',(data)=>{
      let clicks = firebaseListToArray(data);
      let amount = clicks[0]['B'];
      console.log('clicks are: ',amount);
      this.setState({
        clicks:amount
      });
    });
  }
  signUp(e){
    e.preventDefault();
    hashHistory.push('/');
  }

  sessionButton() {
    if (firebase.auth().currentUser) {
      return <LogoutButton>Logout</LogoutButton>;
    }else{
      return(
        <a onClick={this.signUp.bind(this)}>Sign In</a>
      );
    }
  }
  render(){
    let pic ='';
    if(this.props.pic){
      pic = (<img className="user-pic" alt="user" src={this.props.pic} />)
    }
    return(
      <header>
        <div className="title">
          SmartSet
          {/* <div className="click-meter">Number of clicks: {this.state.clicks} </div> */}
          { pic }
        </div>
        <ul className="main_nav">

          <li><NavLink to="/" onlyActiveOnIndex>{this.sessionButton()}</NavLink></li>
          <li><NavLink to="/community"><a href="#">Community</a></NavLink></li>
          <li><NavLink to="/dashboard"><a href="#">Now Playing</a></NavLink></li>
          <li><NavLink to="/addgig"><a href="#">Add Gig</a></NavLink></li>
          <li><NavLink to="/addsong"><a href="#">Add Song</a></NavLink></li>
          <li><NavLink to="/songs"><a href="#">Songs</a></NavLink></li>
          <li><NavLink to="/gigs"><a href="#">Gigs</a></NavLink></li>

        </ul>
      </header>
    );
  }
}

export default Header;
