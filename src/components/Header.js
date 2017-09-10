import React, { Component } from 'react';
import {firebase, firebaseListToArray} from '../utils/firebase';
import NavLink from './NavLink';
import LogoutButton from './LogoutButton';
import jquery from 'jquery';
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
      return <LogoutButton>Log out</LogoutButton>;
    }else{
      return(
        <a onClick={this.signUp.bind(this)}>Log In</a>
      );
    }
  }
  makeActive(e){
    console.log('you have clicked: ',e.target);
    jquery(e.target).addClass('active');
    jquery(this.state.clicked).removeClass('active');
    this.setState({
      clicked:e.target
    });
  }

  render(){
    let pic ='';
    if(this.props.pic){
      pic = (
        <span className="pull-right hidden-xs" id="header-pic">
          <img className="user-pic" alt="" src={this.props.pic} />
        </span>
      )
    }
    const phoneMenu = (
      <button type="button" name="button" data-toggle="collapse" data-target=".navbar-collapse" className="navbar-toggle pull-right">
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
    );
    return(
      <header>
        <div className="title">
          <span id="logo">
            <img id="logo_orange" src="../images/orange.png" alt="logo" />
          </span>
          <span>SmartSet</span>
          { pic }
        </div>
        <ul className="main_nav collapse navbar-collapse">

          <li><NavLink to="/" onlyActiveOnIndex>{this.sessionButton()}</NavLink></li>
          {/* <li><NavLink to="/community"><a onClick={this.makeActive.bind(this)} href="#">Community</a></NavLink></li> */}
          <li><NavLink to="/songs"><a onClick={this.makeActive.bind(this)} href="#">Songs</a></NavLink></li>
          <li><NavLink to="/gigs"><a onClick={this.makeActive.bind(this)} href="#">Gigs</a></NavLink></li>
          <li><NavLink to="/addsong"><a onClick={this.makeActive.bind(this)} href="#">Add Song</a></NavLink></li>
          <li><NavLink to="/addgig"><a onClick={this.makeActive.bind(this)} href="#">Add Gig</a></NavLink></li>
          <li><NavLink to="/dashboard"><a onClick={this.makeActive.bind(this)} href="#">Now Playing</a></NavLink></li>

        </ul>
        { phoneMenu }
      </header>
    );
  }
}

export default Header;
