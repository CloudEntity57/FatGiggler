import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';

import SongButton from './SongButton';

class GigForm extends Component {
  constructor(props){
    super(props);
    this.state={
      uid:0
    }
  }
  componentWillMount(){
  //
    firebase.auth().onAuthStateChanged(
      user => {
        let uid=0;
        if(user){
          console.log('uid: ',user.uid);
          this.setState({
            uid:user.uid
          });
          uid=user.uid;
                firebase.database()
                .ref('/'+uid+'/songs')
                .on('value',(data)=>{
                  let snapshot = data.val();
                  let songs = firebaseListToArray(snapshot);
                  this.setState({
                    songs:songs
                  });
                  console.log('the Dash CWM songs: ',this.state.songs);
                });
        }else{
          hashHistory.push('/');
        }

      });

  }

  shuffle(array){
   var currentIndex = array.length, temporaryValue, randomIndex;

   // While there remain elements to shuffle...
   while (0 !== currentIndex) {

     // Pick a remaining element...
     randomIndex = Math.floor(Math.random() * currentIndex);
     currentIndex -= 1;

     // And swap it with the current element.
     temporaryValue = array[currentIndex];
     array[currentIndex] = array[randomIndex];
     array[randomIndex] = temporaryValue;
   }

   return array;
 }

  filterByMood(songs,feels){
     this.shuffle(songs);
     let moods = feels;
     console.log('songs are:', songs, 'mood is: ',moods);
     let results = [];
     songs.forEach((val) =>{
       // console.log('val: ',val);
       moods.forEach((mood) =>{
         if(val.mood===mood){
           console.log('this song is: ',val.title,',',val.id);
           results.push(val);
         }
       });

     });
     console.log('results',results);
     return results;
   }

  sortByTime(songs,maxtime){
     // songs.forEach((val)=>{
     //   console.log('songs: ',val.title,',',val.length);
     // });
     let gigtime = 0;
     songs.forEach((val)=>{
       gigtime+=val.length;
     });
     console.log('total time: ',gigtime);
     while(gigtime-maxtime > 5){
       songs.pop();
       this.sortByTime(songs,maxtime);
       break;
     }
     // console.log('finally: ');
     return songs;
     // songs.forEach((val)=>{
     //   console.log('songs: ',val.title,',',val.length);
     // });
   }

  filterBySets(songs,numsets){
    let setlen=songs.length/numsets;
      let results={};

      for(let i=0; i<numsets; i++){
        results[i]=[];
        for(let x=0; x<setlen; x++){
          let song = songs.pop();
          if (song){
            results[i].push(song);
          }
        }

      }
      console.log('sets: ',results);
      return results;
   }

  render(){

    const songs = (this.state.songs) ? this.state.songs.map(song => {
          return <SongButton songObject={ song } /> }) : '';
          console.log('songz: ',songs);
          if(this.state.songs){
            this.filterByMood(this.state.songs,['blues']);
          }
    return(
      <div>

        <div className="row">
          <div className="col-sm-2 hidden-xs"></div>
            <div className="col-sm-8">
              <form className="song-form form form-default" action="#" >
                <h1>Create your Gig</h1>
                <div className="form-group">
                  <label for="title-input">Gig Name</label>
                  <input id="title-input" ref="gigtitle" type="text" className="form-control">

                  </input>
                  <label for="maxmin-input">Max Minutes</label>
                  <input id="maxmin-input" ref="max-minutes" type="number" className="form-control"></input>
                  {/* <label for="lyrics-input">Songs</label>
                  {songs} */}
                </div>

                <div className="form-group genres">
                  <div className="form-group add-genres">
                    <input className="form-control" type="text" placeholder="Add Genres" id="add-genre"></input>
                    <button className="btn btn-primary">Add</button>
                  </div>
                  <button className="btn btn-primary btn-xs">Blues</button>
                  <button className="btn btn-primary btn-xs">Slow</button>
                  <button className="btn btn-primary btn-xs">Funk</button>
                  <button className="btn btn-primary btn-xs">Sublime</button>
                  <button className="btn btn-primary btn-xs">Alternative</button>
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="submit" className="btn btn-primary">Done</button>
                </div>
              </form>
            </div>
          <div className="col-sm-2 hidden-xs"></div>
        </div>
      </div>
    );
  }
}


export default GigForm;
