import React, { Component } from 'react';
import SongArea from './SongArea';
import SetList from './SetList';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import moment from 'moment';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state={
      set:"My favorite Set's ID",
      uid:0
    }
  }
  componentWillMount(){
  //
    firebase.auth().onAuthStateChanged(
      user => {
        let uid=0;
        if(user){
          console.log('uid: ',user.uid);
          this.setState({
            uid:user.uid
          });
          uid=user.uid;
              firebase.database()
              .ref('/'+uid+'/gigs')
              .on('value',(data)=>{
                let snapshot = data.val();
                console.log('the gig is: ',snapshot);
                let gig = firebaseListToArray(snapshot);
                this.setState({
                  gig:gig
                });
                console.log('the Dash CWM gigs: ',this.state.gig);
              });


        }else{
          hashHistory.push('/');
        }
  //       // console.log('user is logged as: ',this.state.uid);

      });

  }
  componentDidMount(){
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
    let mysongs = this.state.gig;
    console.log('this.state.gig in render: ',mysongs);
    let html = (mysongs) ?
    <div className="row">
    <SetList />
    <SongArea songs={mysongs[0].gig.sets[0]} />
    </div>
    : '';

    console.log('dashboard render songs: ',mysongs);
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
