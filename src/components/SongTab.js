import React, { Component } from 'react';

class SongTab extends Component{
  render(){
    return(
      <div onClick={this.props.click} id={this.props.id} className="song-icon col-xs-6 col-sm-4">
        <a id={this.props.id} href="#" >
          <div id={this.props.id} className="song-box row">
            <div id={this.props.id} className="col-xs-6">
            <div id={this.props.id}>{this.props.title}</div><p id={this.props.id}> - {this.props.artist}</p>
            </div>
            <div id={this.props.id} className="song-img col-xs-6">
              <img id={this.props.id} className="img-responsive" src={this.props.pic} />
            </div>
          </div>
        </a>
      </div>
    );
  }
}

export default SongTab;
