import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import UserTab from './UserTab';

class Community extends Component{
  constructor(props){
    super(props);
    this.state={
      users:{}
    }
  }
  componentWillMount(){
    let users={};
    firebase.database()
    .ref('users/loggedin')
    .on('value',(data)=>{
      users=data.val();
      users = firebaseListToArray(users);
      console.log('users: ',users);
      let uid = this.props.uid;
      console.log('user id: ',uid);
      let user={};
      for(let i=0; i<users.length; i++){
        if(users[i].id===uid){
          user = users[i];
          console.log('match!');
          this.setState({
            user:user,
            users:users
          });
          break;
        }
      }
    });

    firebase.database()
    .ref('/comments')
    .on('value',(comments)=>{
      comments = comments.val();
      comments = firebaseListToArray(comments);
      console.log('comments: ',comments);
      let posts = comments.map((val)=>{
        return (
          <div><div className="user-tab-comment"><UserTab name={val.name} photo={val.photo} /></div><span className="user-tab-comment">{val.text}</span><div className="comment-date">{val.date}</div></div>
        );
      });
      console.log('posts: ',posts);
      this.setState({
        posts:posts
      });
    });
  }

  componentDidUpdate(){
      this.updateScroll();
  }
  updateScroll(){
    var element = document.getElementById("comment-panel");
    element.scrollTop = element.scrollHeight;
  }
  submitComment(e){
    e.preventDefault();
    let user=this.state.user;
    console.log('user in submit: ',user);
    // let text = (<div><UserTab name={user.name} photo={user.photo} /> {this.refs.comment.value}</div>);
    console.log(this.refs.comment.value);
    let text = this.refs.comment.value;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = mm+'/'+dd+'/'+yyyy;
    console.log('date: ',today);
    firebase.database()
    .ref('/comments')
    .push({
      text:text,
      id:this.props.uid,
      photo:user.photo,
      name:user.name,
      date:today
    });
    this.refs.comment.value='';

  }
  render(){
    let users = firebaseListToArray(this.state.users);
    let user = this.state.user;
    console.log('you are: ',user);
    console.log('users: ',users);
    let user_list = users.map((val)=>{
      if(val.online==="true"){
        return ( <li className="usertab"><UserTab name={val.name} photo={val.photo} /></li> );
      }
    });
    console.log('HTML: ',user_list);
    let posts = this.state.posts;
    // console.log('posts: ',posts);
    return(
      <div className="container">
        <h2>Users Online</h2>
        <div className="row">
          <div className="col-sm-12">
            <ul className="user_list">
              {user_list}
            </ul>
            <section id="comment-panel" className="panel user_comments panel-default">
              {posts}
            </section>

          <span className="usertab">
            {/* <img src={user.photo} alt={user.displayName} /> */}
            <form action="#">
            <input ref="comment" type="text" className="user_chat_input form-control" /><button onClick={this.submitComment.bind(this)} className="btn btn-primary" type="submit">Submit</button>
            </form>
          </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Community;
