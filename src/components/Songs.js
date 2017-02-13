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
    hashHistory.push('/dashboard');
  }
  render(){

    let html = this.state.songs.map((val)=>{
      // console.log('the vals id: ',val.id);
      return(
      <div className="col-sm-4">
        <a href="#" onClick={this.playSong.bind(this)}>
        <div  ref="songname" id={val.id} className="col-xs-4 song-box">
        <div>{val.title}</div> - <p>{val.artist}</p>
      </div>
      </a>
    </div>
        )
    });

    return(
        <div className="song-pg">
          <container className="song-titlebar">
            <h1>Songs</h1>
          </container>
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
