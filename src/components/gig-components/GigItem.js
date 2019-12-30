import React, { Component } from 'react';

class GigItem extends Component{
  constructor(props){
    super(props);
  }
  showSong(){
    this.props.showSong();
  }
  render(){
    const { tune, editButton, deleteButton } = this.props;
    return (
      <div className="gig-item-contain">
        <a href="#">
          <li onClick={this.showSong.bind(this)} id={tune.id}>{tune.title}</li>
        </a>
        <div className="gig-item">{deleteButton} {editButton}</div>
      </div>)
  }
}

export default GigItem;
