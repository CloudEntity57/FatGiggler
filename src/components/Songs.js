import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';

class Songs extends Component{
  constructor(props){
    super(props);
    this.state={
      songs:[]
    }
  }
  componentWillMount(){
    firebase.auth().onAuthStateChanged(
      user => {
        let uid=0;
        if(user){
          // console.log('user: ',user);
          this.setState({
            uid:user.uid
            // userpic:user.photoURL
          });
          uid=user.uid;
          let playing ='';
          firebase.database()
            .ref(uid+'/songs/')
            .on('value',(data)=>{
              let result = data.val();
              result = firebaseListToArray(result);
              this.setState({
                songs:result
              });
            });
          }
          });

  }
  playSong(e){
    e.preventDefault();
    let uid=this.state.uid;
    let song = this.refs.songname.id;
    firebase.database()
    .ref('/users'+uid)
    .set({
      playing:song
    });
    // hashHistory.push('/dashboard');
  }
  render(){

    let html = this.state.songs.map((val)=>{
      // console.log('the vals id: ',val.id);
      return(
      <div className="song-icon col-xs-4">
        <a href="#" onClick={this.playSong.bind(this)}>
          <div className="song-box row">
            <div  ref="songname" id={val.id} className="col-xs-6">
            <div>{val.title}</div><p>{val.artist}</p>
            </div>
            <div className="song-img col-xs-6">
              <img className="img-responsive" src="https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/14671214_10153740440602581_5134318248703944000_n.jpg?oh=70a7e6efb8f88248eae37253c8e05aa6&oe=59166FEB" />
            </div>
          </div>
        </a>
      </div>
        )
    });

    return(
        <div className="song-pg">
          <div className="song-titlebar">
            <h1>Songs</h1>
          </div>
          <div className="container">
            <div className="songs-view">
              {html}
            </div>
          </div>
        </div>

    );
  }
}

export default Songs;
