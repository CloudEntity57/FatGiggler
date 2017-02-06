import React, { Component } from 'react';
import SongArea from './SongArea';
import SetList from './SetList';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';

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
                .ref('/'+uid+'/songs')
                .on('value',(data)=>{
                  let snapshot = data.val();
                  let songs = firebaseListToArray(snapshot);
                  this.setState({
                    songs:songs
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

  }



  render(){
    let html = (this.state.songs) ?
    <div className="row">
    <SetList />
    <SongArea songs={this.state.songs} />
    </div>
    : '';
    console.log('dashboard render songs: ',this.state.songs);
    let songs = this.state.songs;
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
