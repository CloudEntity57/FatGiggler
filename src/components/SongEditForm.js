import React, { Component } from 'react';

class SongEditForm extends Component{
  submit(e){
    e.preventDefault();
    let title= this.refs.title.value;
    let lyrics= this.refs.lyrics.value;
    let artist= this.refs.artist.value;
    this.props.submit(title,lyrics,artist);
  }
  render(){
    return(
      <div className="song-update-form">
      <form id={this.props.id} onSubmit={this.submit.bind(this)} className="song-edit-form form form-default">
        <button type="submit" className="btn-xs btn-success">Submit</button>
        <input ref="title" className="form-control" defaultValue={this.props.title} />
        <input ref="artist" className="form-control" defaultValue={this.props.artist}/>
        <textarea ref="lyrics" className="form-control song-edit-text" defaultValue=
          {this.props.lyrics} />
        <button type="submit" className="btn-xs btn-success">Submit</button>
        <br></br>
        <br></br>
      </form>
      </div>
    );
  }
}

export default SongEditForm;
