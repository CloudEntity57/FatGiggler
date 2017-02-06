import React, { Component } from 'react';

class SongButton extends Component {
  render() {
    return (
      <div>
        <button key={ this.props.songObject.id } className="btn btn-success">{ this.props.songObject.title }</button>
      </div>
    )
  }
}

export default SongButton;
