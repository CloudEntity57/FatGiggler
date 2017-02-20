import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import Song from './Song';

class Songs extends Component{
  constructor(props){
    super(props);
    this.state={
      songs:[],
      isplaying:false,
      playing:''
    }
  }
  componentWillMount(){
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
          let playing ='';
          firebase.database()
            .ref(uid+'/songs/')
            .on('value',(data)=>{
              let result = data.val();
              result = firebaseListToArray(result);
              this.setState({
                songs:result
              });
            });
          }
          });

  }
  playSong(e){
    console.log('playSong');
    e.preventDefault();
    let uid=this.state.uid;
    let song = e.target.id;
    let target = e.target;
    console.log('song id in playsong: ',song);
    console.log('target: ',target);
    this.setState({
      isplaying:true,
      playing:song
    });
    // hashHistory.push('/dashboard');
  }
  displaySongs(){
    this.setState({
      isplaying:false
    });
  }
  render(){

    let html = (this.state.isplaying) ? <Song cancel={this.displaySongs.bind(this)} id={this.state.uid} song={this.state.playing}/>
     : this.state.songs.map((val)=>{
      // console.log('the vals id: ',val.id);
      return(
      <div onClick={this.playSong.bind(this)} className="song-icon col-xs-6 col-sm-4">
        <a href="#" >
          <div id={val.id} className="song-box row">
            <div ref="songname" className="col-xs-6">
            <div id={val.id}>{val.title}</div><p id={val.id}>{val.artist}</p>
            </div>
            <div className="song-img col-xs-6">
              <img id={val.id} className="img-responsive" src="https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/14671214_10153740440602581_5134318248703944000_n.jpg?oh=70a7e6efb8f88248eae37253c8e05aa6&oe=59166FEB" />
            </div>
          </div>
        </a>
      </div>
        )
    });

    return(
        <div className="song-pg">
          <div className="song-titlebar">
            <h1>Songs</h1>
          </div>
          <div className="container">
            <div className="songs-view">
              {html}
            </div>
          </div>
        </div>

    );
  }
}

export default Songs;
