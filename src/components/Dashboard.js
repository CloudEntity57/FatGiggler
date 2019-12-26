import React, { Component } from 'react';
import SongArea from './SongArea';
import SetList from './SetList';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import moment from 'moment';
import jquery from 'jquery';
import dotenv from 'dotenv';
import makesets from '../utils/makesets';
import Default from './DefaultGig';
import DefaultSongs from './DefaultSongs'
import { findLyrics } from './ArtistQuery';
import AsyncService from '../services/http';
// import { musixMatch } from './MusixMatch';
dotenv.config({silent:true});


class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state={
      defaultset:"My favorite Set's ID",
      uid:0,
      showdefault:true,
      genres:['rock','pop','Singer/Songwriter'],
      playing:props.playing
    }
    this.http = new AsyncService();
  }

  componentWillMount(){

  let defaultgig = Default.defaultgig;
  console.log('defaultshow: ',defaultgig);
    let newuser=true;
    firebase.auth().onAuthStateChanged(
      user => {
        let uid=0;
        if(user){
          this.setState({
            uid:user.uid
          });
          uid=user.uid;
          //------------------------------------------filter for new users
          let name = user.displayName;
          console.log('uid: ',uid);
          this.setState({
            userpic:user.photoURL
          });
          this.checkUserStatus(newuser,uid,user);
          //------------------------------------------repeat user entry to DB

          //retrieve all existing gigs from the database:
          this.getGigs(uid);

        }else{
          let songs=defaultgig.sets;
          let gig=Default.defaultgig;
          this.setState({
            songs:songs,
            gig:gig
          });
        }
      });

  }

  componentDidMount(){
    let hrs = 4;
    let min = 35;
    let sec = 23;
    let newmin = 30;
    newmin = moment.duration({minutes:newmin})._milliseconds;
    hrs = moment.duration({hours:hrs})._milliseconds;
    min = moment.duration({minutes:min})._milliseconds;
    sec = moment.duration({seconds:sec})._milliseconds;
    let final = hrs + min + sec;
    final+=newmin;
    let full = moment.duration(final);
    let y = full.hours() + ':'+ full.minutes() + ':' + full.seconds();
}

  getGigs(uid){
    this.http.get('/'+uid)
    .then((data)=>{
        let snapshot = data.val();
        console.log('snapshot - ',snapshot)
        let user = snapshot;
        console.log('user: ',user)
        let gigs = firebaseListToArray(user.gigs);
        let songs = firebaseListToArray(user.songs);
        // Compile a single array of all the songs in the user's default gig:
        let usr_default_gig = [];
        let playing = this.props.playing;
        if(!playing) {
          console.log('no default!');
          usr_default_gig = Default.defaultgig;
        }else{
            gigs.forEach((val)=>{
                if(playing===val.id){
                  console.log('this gig is: ',val.gig);
                  usr_default_gig = val.gig;
                }
            });
        }
        // console.log('the default gig we are working with is: ',usr_default_gig);
        let usr_default = [];
        usr_default_gig.sets.forEach((val)=>{
          for(let i=0; i<songs.length; i++){
            if(songs[i].id===val.id){
              usr_default.push(songs[i]);
            }
          }
        });
        // usr_default = DefaultSongs.songs;
        console.log('usr_default: ',usr_default);
        // Pass both the song and set arrays to the state:
        this.setState({
          songs:usr_default,
          gig:usr_default_gig
        });
    });
  }

  checkUserStatus(newuser,uid,user){
    this.http.get('/users/loggedin')
    .then((val)=>{
      val = val.val();
      val = firebaseListToArray(val);
      console.log('vals to filter for new users: ',val);
      this.filterNewUser(val,newuser,uid,name,user);
    });
  }
  filterNewUser(val,newuser,uid,name,user){
    val.forEach((i)=>{
      if(i.id===uid){
        newuser=false;
        firebase.database()
        .ref('/users/loggedin/'+uid)
        .set({
          name:user.displayName,
          photo:user.photoURL,
          online:'true'
        });
      }
    });
    if(newuser===true){
      this.setUpNewUser(uid,name,user);
    };
  }
  setUpNewUser(uid,name,user){

      let defaultsongs = DefaultSongs.songs;
      firebase.database()
      .ref('/users/loggedin/'+uid)
      .set({
        name:user.displayName,
        photo:user.photoURL,
        online:'true'
      });
        firebase.database()
        .ref('/'+uid)
        .set({
          songs:defaultsongs
        });
      console.log('welcome new user!');
      this.setState({
        newuser:true,
        playing:''
      });
}

  navigate(id){
    this.setState({
      target:id
    });
  }
  hideIntro(e){
    e.preventDefault();
    this.setState({
      newuser:false
    });
  }

  render(){
    //create JSX for songs to pass to SongArea:
    let mysongs = this.state.songs;
    let target = this.state.target;
    let intro = (this.state.newuser) ? (
      <div onClick={this.hideIntro.bind(this)} className="intro">

      </div>
    ) : '';
    // let intro = (
    //   <div onClick={this.hideIntro.bind(this)} className="intro">
    //
    //   </div>
    // );
    let introText = (this.state.newuser) ? (
      <div className="intro-text lead">
        <a href="#"><div onClick={this.hideIntro.bind(this)} className="closeX">x</div></a>
        <p><h3>Welcome to SmartSet!</h3> To help you get started, we've loaded some example songs into your account. The site is simple:
          <ul>
            <li>Songs - view and edit your songs</li>
            <li>Add Songs - Add new songs to your account</li>
            <li>Add Gig - generate and preview a gig</li>
            <li>Gigs - view, edit and display gigs</li>
            <li>Now Playing - displays gig you're currently playing</li>
            <li>Community - chat with other musicians</li>
          </ul>
        </p>
      </div>
    ): '';

    // console.log('target in render: ',target);
    console.log('songs being passed to SongArea: ',mysongs);
    //create JSX for separate set lists to pass to SetList:
    let mygig = this.state.gig;
    let html = (mysongs && mygig) ?
    <div className="row">
    <SetList songs={mysongs} scroll={this.navigate.bind(this)} id={this.state.uid} gig={mygig}/>
    <SongArea songs={mysongs} target={target}/>
    </div>
    : '';
    // console.log('dashboard render gig: ',mygig);
    // let songs = this.state.songs;


    return(
      <div>
        <div className="wrapper container landed_content">
          { html }
        </div>
        { intro }
        { introText }
      </div>
    );
  }
}

export default Dashboard;
