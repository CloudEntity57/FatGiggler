import React, { Component } from 'react';

class UserTab extends Component{
  render(){
    return(<div className="usertab"><img src={this.props.photo} alt={this.props.name} /> <span className="username" >{this.props.name}</span></div>
    );
  }
}

export default UserTab;
