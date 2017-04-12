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
      playing:this.props.playing
    }
  }

  componentWillMount(){

  let defaultgig = Default.defaultgig;
  console.log('defaultshow: ',defaultgig);
    let newuser=true;
    firebase.auth().onAuthStateChanged(
      user => {
        let uid=0;
        if(user){
          // console.log('user: ',user);
          this.setState({
            uid:user.uid
            // userpic:user.photoURL
          });
          uid=user.uid;
          //------------------------------------------repeat user entry to DB
          let name = user.displayName;
          console.log('uid: ',uid);
          this.setState({
            userpic:user.photoURL
          });
          this.checkUserStatus(newuser,uid,user);

          //------------------------------------------repeat user entry to DB
          let playing ='';
  //retrieve all existing gigs from the database:

              firebase.database()
              .ref('/'+uid)
              .on('value',(data)=>{
                    let snapshot = data.val();
                    let user = firebaseListToArray(snapshot);
                    console.log('user: ',user);
                    let gigs = firebaseListToArray(snapshot.gigs);
                    let songs = firebaseListToArray(snapshot.songs);
                    // console.log('the gigs we are working with are: ',gigs);
                    // Compile a single array of all the songs in the user's default gig:
                    let usr_default_gig = [];
                    playing = this.props.playing;
                    if(!playing) {
                      console.log('no default!');
                      usr_default_gig = Default.defaultgig;
                    }else{
                          gigs.forEach((val)=>{
                            console.log('val.id: ',val.id,' playing: ',playing);
                            // console.log('playing: ',playing);

                                if(playing===val.id){
                                  // console.log('match!!!!!');
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
                    // if(usr_default.length===0){
                    //   console.log("it's empty");
                    //   usr_default=usr_default_gig.sets;
                    // }
                    this.setState({
                      songs:usr_default,
                      gig:usr_default_gig
                    });
                    // console.log('the Dash CWM songs: ',this.state.songs);
              });
        }else{
          let songs=defaultgig.sets;
          let gig=Default.defaultgig;
          this.setState({
            songs:songs,
            gig:gig
          });
        }
        // else{
        //   hashHistory.push('/');
        // }
  //       // console.log('user is logged as: ',this.state.uid);

      });

  }
  checkUserStatus(newuser,uid,user){
    firebase.database()
    .ref('/users/loggedin')
    .on('value',(val)=>{
      val = val.val();
      val = firebaseListToArray(val);
      console.log('vals to filter for new users: ',val);
      this.filterNewUser(val,newuser,uid,name,user);

    });
  }
  filterNewUser(val,newuser,uid,name,user){
    val.forEach((i)=>{
      // i=firebaseListToArray(i);
      console.log('i.id: ',i.id);
      if(i.id===uid){
        newuser=false;
        console.log('user exists');
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

  componentDidMount(){

    // let totaltime = 163520000;
    // console.log('totaltime: ',totaltime);
    // totaltime = moment(totaltime).format("m:ss");
    // console.log('total: ',totaltime);


    let hrs = 4;
    let min = 35;
    let sec = 23;

    let newmin = 30;
    newmin = moment.duration({minutes:newmin})._milliseconds;
    // let sec = 23;
    hrs = moment.duration({hours:hrs})._milliseconds;
    min = moment.duration({minutes:min})._milliseconds;
    sec = moment.duration({seconds:sec})._milliseconds;
    // sec = moment.duration({seconds: sec})._milliseconds;
    console.log('hrs: ',hrs);
    console.log('min: ',min);
    console.log('sec: ',sec);
    let final = hrs + min + sec;
    console.log('final: ',final);
    final+=newmin;
    // console.log('sec: ',sec);
    // let full = hrs+sec;
    let full = moment.duration(final);
    let y = full.hours() + ':'+ full.minutes() + ':' + full.seconds();
    // hrs = moment(hrs).format("h:mm:ss");
    // full = moment(full).format("m:ss");
    console.log('final hrs: ',y);

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
        Welcome! Please enjoy these instructions.
      </div>
    ) : '';
    // let intro = (
    //   <div onClick={this.hideIntro.bind(this)} className="intro">
    //
    //   </div>
    // );
    let introText = (this.state.newuser) ? (
      <div className="intro-text lead">
        <p><h3>Welcome to SmartSet!</h3> To help you get started, we've loaded some example songs into your account. The site is simple:
          <ul>
            <li>Songs - view and edit your songs</li>
            <li>Add Songs - fill out a simple form to enter new songs</li>
            <li>Add Gig - generate and preview gigs featuring your songs</li>
            <li>Gigs - view and play these gigs</li>
            <li>Now Playing - the gig you're currently playing</li>
            <li>Community - chat with other musicians online</li>
          </ul>
        </p>
      </div>
    ) : '';
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
