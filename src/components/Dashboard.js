import React, { Component } from 'react';
import SongArea from './SongArea';
import SetList from './SetList';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
// import moment from 'moment';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state={
      defaultset:"My favorite Set's ID",
      uid:0,
      showdefault:true
    }
  }
  componentWillMount(){
  //
    firebase.auth().onAuthStateChanged(
      user => {
        let uid=0;
        if(user){
          // console.log('uid: ',user.uid);
          this.setState({
            uid:user.uid
          });
          uid=user.uid;
          let playing ='';
          firebase.database()
            .ref('/users/'+uid+'/playing/')
            .on('value',(data)=>{
              let result = data.val();
              console.log('now actually playing: ',result);
              this.setState({
                playing:result
              });
            });
              playing = this.state.playing;
              console.log('playing has been reset to: ',playing);
              //retrieve all existing gigs from the database:
              firebase.database()
              .ref('/'+uid)
              .on('value',(data)=>{
                    let snapshot = data.val();
                    let user = firebaseListToArray(snapshot);
                    console.log('user: ',user);
                    let gigs = firebaseListToArray(snapshot.gigs);
                    console.log('the gigs we are working with are: ',gigs);


                    // Compile a single array of all the songs in the user's default gig:
                    let usr_default_gig = [];

                    if(!playing) {
                      usr_default_gig = gigs[0].gig
                      console.log('were setting it to default');
                    }else{
                      console.log('theres something playing',gigs);
                          gigs.forEach((val)=>{
                            console.log('playin id: ',val.id);
                            console.log('playing: ',playing);

                                if(playing===val.id){
                                  console.log('match!!!!!');
                                  console.log('this gig is: ',val);
                                  usr_default_gig = val.gig;
                                }
                          });
                    }
                    console.log('the default gig we are working with is: ',usr_default_gig);
                    let usr_default = [];
                    usr_default_gig.sets.forEach((val)=>{
                      usr_default = usr_default.concat(val);
                    });
                    // Pass both the song and set arrays to the state:
                    this.setState({
                      songs:usr_default,
                      gig:usr_default_gig
                    });
                    console.log('the Dash CWM songs: ',this.state.songs);
              });
        }else{
          hashHistory.push('/');
        }
  //       // console.log('user is logged as: ',this.state.uid);

      });

  }
  componentDidMount(){

    //TESTING THE FUNCTIONS AND FEATURES OF MOMENT.JS FOR TIME ADDITION/COMPARISON:

    // let time1 = moment.duration('00:6:30');
    // let time2 = moment.duration('00:05:30');
    // let result = time1+time2
    // console.log('milisec: ',time2);
    // result = moment(result).format("m:ss");
    // console.log('time is: ',result);
    // let minutes = 6;
    // let seconds = 30;
    // minutes = moment.duration('00:'+minutes+':00');
    // seconds = moment.duration('00:00:'+seconds);
    // console.log('the minutes are: ',minutes);
    // console.log('the seconds are: ',seconds);
    // let result2 = minutes+seconds;
    // result2 = moment(result2).format("m:ss");
    // console.log('time2 is: ',result2);
    // let testtime = '6:30';
    // testtime = moment(testtime,"m:ss");
    // console.log('testtime *2 = ',testtime+testtime);


  }



  render(){
    //create JSX for songs to pass to SongArea:
    let mysongs = this.state.songs;
    // console.log('this.state.gig in render: ',mysongs);
    //create JSX for separate set lists to pass to SetList:
    let mygig = this.state.gig;
    let html = (mysongs && mygig) ?
    <div className="row">
    <SetList gig={mygig}/>
    <SongArea songs={mysongs} />
    </div>
    : '';
    // console.log('dashboard render gig: ',mygig);
    // let songs = this.state.songs;


    return(
      <div>
      <div className="wrapper container">
        { html }
      </div>

  </div>

    );
  }
}

export default Dashboard;
