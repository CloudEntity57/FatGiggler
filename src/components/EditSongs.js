import React, { Component } from 'react';

class EditSongs extends Component{
  render(){
    return(
      <button onClick={this.props.edit} className="btn-xs btn-default songs-edit-btn">Manage Songs</button>
    )
  }
}

export default EditSongs;
