import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import SongEditForm from './SongEditForm';
import SubmitModal from './SubmitModal';
import DefaultSongs from './DefaultSongs';
import DefaultGig from './DefaultGig';

class Song extends Component {
  constructor(props){
    super(props);
    this.state={
      song:[],
      submitted:false
    }
  }

  componentWillMount(){
    let song = '';
    let songid = this.props.song;
    console.log('songid: ',songid);
    console.log('userid: ',this.props.id);
    let uid = this.props.id;

    firebase.database()
    .ref(uid+'/songs/'+songid)
    .on('value',(data)=>{
      song = data.val();
      console.log('Song.js song: ',song);
    });
    if(song !== null && song !==''){
      console.log('the song is not null: ',song);
    this.setState({
      song:song,
      songid:songid
    });
  }else{
    console.log('the song equals nothing');
    let songs=DefaultSongs.songs;
    console.log('default songs: ',songs);
    for(let val in songs){
      console.log('default val: ',val);
      if(val.id===songid){
        console.log(song + '===' + val);
        song=val;
      }
    }
    this.setState({
      song:song,
      songs:songs
    });
  }
  }
  componentDidMount(){
    let song = '';
    let songid = this.props.song;
    console.log('songid: ',songid);
    console.log('userid: ',this.props.id);
    let uid = this.props.id;

    firebase.database()
    .ref(uid+'/songs/'+songid)
    .on('value',(data)=>{
      song = data.val();
      console.log('Song.js song: ',song);
    });
    if(song !== null && song !==''){
    this.setState({
      song:song,
      songid:songid
    });
  }else{
    console.log('the song equals nothing');
    let songs=DefaultSongs.songs;
    console.log('default songs: ',songs);
    songs.forEach((val)=>{
      console.log('val: ',val.id);
      console.log('songid: ',songid);
      if(val.id===parseInt(songid)){
        console.log(song + '===' + val);
        song=val;
      }
    });
    this.setState({
      song:song,
      songs:songs
    });
  }
  }

  cancel(e){
    e.preventDefault();
    this.props.cancel();
  }
  edit(e){
    e.preventDefault();
    if(this.props.id===''){
      this.setState({
        submitted:true,
        modaltext:'You gotta log in first.'
      });
      return;
    }
    console.log('editing');
    if(!this.state.editing){
      this.setState({
        editing:true
      });
    }else{
      this.setState({
        editing:false
      });
    }
  }
  submit(title,lyrics,artist){
    let songid = this.state.songid;
    let uid = this.props.id;
    firebase.database()
    .ref('/'+uid+'/songs/'+songid)
    .ref.update({
      title:title,
      lyrics:lyrics,
      artist:artist
    });
    firebase.database()
    .ref(uid+'/songs/'+songid)
    .on('value',(data)=>{
      let song = data.val();
      if(song){
        this.setState({
          song:song,
          songid:songid,
          editing:false
        });
      }
    });


    // this.setState({
    //   editing:false
    // });
  }
  hideModal(){
    this.setState({
      submitted:false
    });
  }
 render(){
    let please_login = (this.state.submitted) ? (<SubmitModal text={this.state.modaltext} hide={this.hideModal.bind(this)}/>) : '';
    console.log('song: ',this.state.song);
    let song = this.state.song;
    let html = (!this.state.editing) ? (
      <div className="songmodal" id={song.id}>
        <div className="song-btn-row">
          <img className="songmodal_pic" src={song.pic} />
          <div>
            <button onClick={this.edit.bind(this)} className="btn-xs song-btn btn-primary song-close">Edit</button>
            <button onClick={this.cancel.bind(this)} className="btn-xs song-btn song_edit_btn song-close">Close</button>
          </div>
        </div>
        <h2>{song.title}</h2>
        <p>- {song.artist}</p>
        <div className="lyrics">
          {song.lyrics}
        <br></br>
        <br></br>
        </div>
        {please_login}
      </div>
    )
    : (
      <div>
      <div className="container">
        <div className="song-btn-row">
          <div>
            <button onClick={this.edit.bind(this)} className="btn-xs song-btn btn-primary song-close">Edit</button>
            <button onClick={this.cancel.bind(this)} className="btn-xs song-btn song_edit_btn song-close">Close</button>
          </div>
        </div>
      </div>
      <SongEditForm id={song.id} genres={song.moods} submit={this.submit.bind(this)} title={song.title} artist={song.artist} lyrics={song.lyrics} />
      {please_login}
      </div>
    );
    return(

          <div className="song-show clearfix">{html}</div>

    )
  }
}

export default Song;
