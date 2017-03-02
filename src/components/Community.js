import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';

class Community extends Component{
  constructor(props){
    super(props);
    this.state={
      users:{}
    }
  }
  componentWillMount(){
    let users=[];
    firebase.database()
    .ref('users/loggedin')
    .on('value',(data)=>{
      users=data.val();
      // console.log('users: ',users);
      this.setState({
        users:users
      });
    });
  }
  render(){
    let users = firebaseListToArray(this.state.users);
    console.log('users: ',users);
    let html = users.map((val)=>{
      if(val.online==="true"){
      return (<div className="usertab"> <span className="username" >{val.name}</span><img src={val.photo} alt={val.name} /> </div>);
    }
    });
    console.log('HTML: ',html);
    return(
      <div className="container">
        <h2>Users Online</h2>
        <div className="row">
          <div className="col-sm-12">
            {html}
          </div>
        </div>
      </div>
    );
  }
}

export default Community;
