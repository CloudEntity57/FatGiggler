import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';

class Song extends Component {
  constructor(props){
    super(props);
    this.state={
      song:[]
    }
  }

  componentWillMount(){
    let song = '';
    let songid = this.props.song;
    console.log('userid: ',this.props.id);
    let uid = this.props.id;
    firebase.database()
    .ref(uid+'/songs/'+songid)
    .on('value',(data)=>{
      song = data.val();
    });
    if(song){
    this.setState({
      song:song,
      songid:songid
    });
  }

  }
  cancel(e){
    e.preventDefault();
    this.props.cancel();
  }
  edit(e){
    e.preventDefault();
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
  submit(e){
    e.preventDefault();
    let songid = this.state.songid;
    let title= this.refs.title.value;
    let lyrics= this.refs.lyrics.value;
    let artist= this.refs.artist.value;
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
  render(){
    console.log('song: ',this.state.song);
    let song = this.state.song;
    let html = (!this.state.editing) ? (
      <div className="songmodal" id={song.id}>
        <div className="song-btn-row">
        <button onClick={this.edit.bind(this)} className="btn-xs song_edit_btn song-close">Edit</button>
        <button onClick={this.cancel.bind(this)} className="btn-xs btn-success song-close">Close</button>
      </div>
        <h2>{song.title}</h2>
        <div className="lyrics">
          {song.lyrics}
        <br></br>
        <br></br>
        </div>
      </div>
    )
    : (
      <div>
      <div className="song-btn-row">
        <button onClick={this.edit.bind(this)} className="btn-xs song_edit_btn song-close">Edit</button>
        <button onClick={this.cancel.bind(this)} className="btn-xs btn-success song-close">Close</button>
      </div>
      <form id={song.id} onSubmit={this.submit.bind(this)} className="song-edit-form form form-default">
        <input ref="title" className="form-control" defaultValue={song.title}/>
        <input ref="artist" className="form-control" defaultValue={song.artist}/>
        <textarea ref="lyrics" className="form-control song-edit-text" defaultValue=
          {song.lyrics} />
        <button type="submit" className="btn-xs btn-default">Submit</button>
        <br></br>
        <br></br>
      </form>
      </div>
    );
    return(
      <div>
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="song-show col-sm-6">{html}</div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    )
  }
}

export default Song;
