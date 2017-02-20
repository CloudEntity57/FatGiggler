import React, { Component } from 'react';

class Song extends Component {
  let song = this.props.song;
  console.log('our song playing is: ',song);
  render(){
    return(
      <div>
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6"></div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    );
  }
}

export default Song;
