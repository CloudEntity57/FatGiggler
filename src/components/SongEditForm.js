import React, { Component } from 'react';

class SongEditForm extends Component{
  render(){
    return(
      <div>
      <form id={this.props.id} onSubmit={this.props.submit} className="song-edit-form form form-default">
        {this.props.submitbtn}
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
