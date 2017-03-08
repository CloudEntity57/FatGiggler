import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import EditSongs from './EditSongs';
import SongTab from './SongTab';
import Song from './Song';
import { defaultshow } from './DefaultGig';

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
            uid:user.uid,
            user:user.displayName
            // userpic:user.photoURL
          });
          uid=user.uid;
          firebase.database()
            .ref(uid+'/songs/')
            .on('value',(data)=>{
              let result = data.val();
              result = firebaseListToArray(result);
              if(result.length===0){
                result=defaultshow().sets;
              }
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
    let editVeil = (this.state.editing) ? (<div onClick={this.edit.bind(this)} className="edit-veil"></div>)
    :'';
    let editButton=(!this.state.isplaying) ? (<EditSongs className="editor" edit={this.edit.bind(this)} />)
    : ''
    let html = (this.state.isplaying) ?
    (
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6">
          <Song cancel={this.displaySongs.bind(this)} id={this.state.uid} song={this.state.playing}/>
        </div>
        <div className="col-sm-3"></div>
      </div>
    )

     : this.state.songs.map((val)=>{
      // console.log('the vals id: ',val.id);
      return(
        <SongTab editing={this.state.editing} uid={this.state.uid} id={val.id} artist={val.artist} pic={val.pic} title={val.title} clicked={this.playSong.bind(this)} />
        )
    });
    let user = this.state.user;
    return(
        <div className="song-pg">

          <div className="song-titlebar">
            {editVeil}
            <h1>{user}'s Songs</h1>
            <div className="editbutton">
            { editButton }
            </div>
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
