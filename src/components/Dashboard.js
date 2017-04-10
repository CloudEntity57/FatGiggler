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
import { findLyrics } from './ArtistQuery';
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

        // console.log('the set playing in app is: ',this.props.playing);
        // findLyrics('bob dylan the times they are a changing');
          //----====================MUSIXMATCH API CONNECTION TEST======================================//

            // let musix = process.env.REACT_APP_MUSIX_APP_API;
            // console.log('my api key is: ',musix);
            //
            // // let artists = [
            // //   "bob dylan",
            // //   "jeff buckley",
            // //   "ed sheeran",
            // //   "bruno mars",
            // //   "leonard cohen",
            // //   "B.B. King",
            // //   "grateful dead",
            // //   "beatles",
            // //   "elvis presley",
            // //   "ray charles",
            // //   "stevie wonder",
            // //   "steely dan",
            // //   "david bowie",
            // //   "prince",
            // //   "frank sinatra",
            // //   "aretha franklin",
            // //   "tori amos"
            // // ];
            // let artists = [
            //   "bob dylan"
            //  ];
            // let artists_htmlstring= artists.map((val)=>{
            //   var mod = val.replace(/ /g,'%20');
            //   return mod;
            // });
            //
            // let artists_query_array = artists_htmlstring.map((val)=>{
            //   let api_top10_search_str = "http://api.musixmatch.com/ws/1.1/track.search?apikey="+musix+"&q_artist="+val+"&page_size=10&page=1&s_track_rating=desc";
            //   // console.log('search string: ',api_top10_search_str);
            //   return api_top10_search_str;
            // });
            // // console.log('modified array: ',artists_query_array);
            // let result_array = [];
            // let defaultsongs = [];
            // for(let i=0; i<artists_query_array.length; i++){
            //   jquery.get(artists_query_array[i],(val)=>{
            //     var output = JSON.parse(val);
            //     console.log('we are getting for output: ',output.message.body.track_list);
            //     result_array.push(output.message.body.track_list);
            //         if(result_array.length === artists.length){
            //           console.log('result arrays length: ',result_array.length);
            //           console.log('result array: ',result_array);
            //           for(let i=0; i<result_array.length; i++){
            //             console.log('result_array item: ',result_array[i]);
            //           // go through every song in the list
            //             for(let n=0; n<result_array[i].length; n++){
            //           // for each song save the title, artist, length, lyrics and genres inside an object identical to song database
            //               let mysong = result_array[i][n];
            //               console.log('my song: ',mysong);
            //               let songObject = {};
            //               songObject.title = mysong.track.track_name;
            //               songObject.artist = mysong.track.artist_name;
            //               songObject.trackid = mysong.track.track_id;
            //               defaultsongs.push(songObject);
            //           // push that object to the default song array and set the default state to that array
            //             }
            //           //pass those songs to the two dashboard components for display
            //           }
            //           console.log('default songs: ',defaultsongs);
            //           this.setState({
            //             defaultsongs:defaultsongs
            //           });
            //         }
            //   });
            // }
            //
            //


            //create default gig for user from the site's default artist database

            // let defaultgig={
            //   title:'My Gig',
            //   genres:this.state.genres,
            //   sets:setfiltered,
            //   maxminutes:216000000
            // };


          //===================================//
  //
  let defaultgig = Default.defaultshow();

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
            name:name,
            photo:user.photoURL,
            online:'true'
          });
          //------------------------------------------repeat user entry to DB
          let playing ='';
              // console.log('playing has been reset to: ',playing);
              //retrieve all existing gigs from the database:


              firebase.database()
              .ref('/'+uid)
              .on('value',(data)=>{
                    let snapshot = data.val();
                    let user = firebaseListToArray(snapshot);
                    // console.log('user: ',user);
                    let gigs = firebaseListToArray(snapshot.gigs);
                    let songs = firebaseListToArray(snapshot.songs);
                    // console.log('the gigs we are working with are: ',gigs);


                    // Compile a single array of all the songs in the user's default gig:
                    let usr_default_gig = [];
                    playing = this.props.playing;
                    if(!playing) {
                      console.log('no default!');
                      usr_default_gig = defaultgig;
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
                    console.log('usr_default: ',usr_default);
                    // Pass both the song and set arrays to the state:
                    if(usr_default.length===0){
                      console.log("it's empty");
                      usr_default=usr_default_gig.sets;
                    }
                    this.setState({
                      songs:usr_default,
                      gig:usr_default_gig
                    });
                    // console.log('the Dash CWM songs: ',this.state.songs);
              });
        }else{
          // let songs=defaultshow().sets;
          // let gig=defaultshow();
          let songs = Default.defaultshow().sets;
          let gig = Default.defaultshow();
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


    // console.log('final full time: ',full);
    // full = moment.duration({minutes: full})._milliseconds;
    // console.log('full to milliseconds: ',full);


    // let defaultsongs2 = this.state.songs;
    // let defaultsongs = [];
    // for(let i=0; i<defaultsongs2.length; i++){
    //   defaultsongs.push(defaultsongs2[i]);
    // }

    // console.log('the defaultsongs state: ',defaultsongs2);
    //
    // let gigtitle = 'My Fat Gig';
    // let maxminutes = 35;
    // //format in moment.js
    // maxminutes = moment.duration(maxminutes+':00')._milliseconds;
    // console.log('the maximum number of minutes allowed:',maxminutes);
    // //
    // let genresdesired = this.state.genres;
    // console.log('genres are: ',genresdesired);
    // let setsdesired = 3;
    // makesets.updateGig(defaultsongs2,gigtitle,maxminutes,genresdesired,setsdesired);
    // console.log('the default gig on Dashboard: ',this.state.gig);

}
  navigate(id){
    this.setState({
      target:id
    });
  }

  render(){
    //create JSX for songs to pass to SongArea:
    let mysongs = this.state.songs;
    let target = this.state.target;
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
      </div>
    );
  }
}

export default Dashboard;
