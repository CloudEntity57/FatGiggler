import React, { Component } from 'react';

class GigView extends Component{

  editSongs(e){
    e.preventDefault();
    this.props.editSongs();
  }
  render(){
    return(
      <div>
      <div className="gig-buttons">
      <button onClick={this.props.playGig} id={this.props.id} className="btn btn-primary">Play</button>
      <button onClick={this.editSongs.bind(this)} id={this.props.id} className="btn btn-primary">Edit</button>
      <button onClick={this.props.done} className="btn btn-primary hidden-sm hidden-md hidden-lg">Done</button>
      </div>
      <h1>{this.props.title}</h1>
      <ul>
        { this.props.frame }
      </ul>
    </div>
    )
  }
}

export default GigView;
