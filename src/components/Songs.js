import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import SongTab from './SongTab';
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
    console.log('song in playsong: ',song);
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
  edit(e){
    e.preventDefault();
    if(!this.state.editing){
      console.log('setting to true!');
      this.setState({
        editing:true
      });
    }else{
      console.log('setting to false!');
      this.setState({
        editing:false
      });
    }
  }
  render(){
    let editButton=(!this.state.isplaying) ? (<button onClick={this.edit.bind(this)} className="btn btn-default">Edit Songs</button>) 
    : ''
    let html = (this.state.isplaying) ? <Song cancel={this.displaySongs.bind(this)} id={this.state.uid} song={this.state.playing}/>
     : this.state.songs.map((val)=>{
      // console.log('the vals id: ',val.id);
      return(
        <SongTab editing={this.state.editing} uid={this.state.uid} id={val.id} artist={val.artist} pic={val.pic} title={val.title} clicked={this.playSong.bind(this)} />
        )
    });

    return(
        <div className="song-pg">
          <div className="song-titlebar">
            <h1>Songs</h1>{ editButton }
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
