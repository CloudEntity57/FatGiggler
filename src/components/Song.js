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
      song:song
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
  render(){
    console.log('song: ',this.state.song);
    let song = this.state.song;
    let html = (!this.state.editing) ? (
      <div id={song.id}>
        <div className="song-btn-row">
        <button onClick={this.edit.bind(this)} className="btn-xs song_edit_btn song-close">Edit</button>
        <button onClick={this.cancel.bind(this)} className="btn-xs btn-success song-close">Close</button>
      </div>
        <h2>{song.title}</h2>
        <div>
          {song.lyrics}
        <br></br>
        <br></br>
        </div>
      </div>
    )
    : (
      <div id={song.id}>
        <div className="song-btn-row">
        <button onClick={this.edit.bind(this)} className="btn-xs song_edit_btn song-close">Edit</button>
        <button onClick={this.cancel.bind(this)} className="btn-xs btn-success song-close">Close</button>
      </div>
      <form className="song-edit-form form form-default">
        <input className="form-control" defaultValue={song.title}/>
        <textarea className="form-control song-edit-text" defaultValue=
          {song.lyrics} />
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
