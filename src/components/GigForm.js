import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';

import SongButton from './SongButton';

class GigForm extends Component {
  constructor(props){
    super(props);
    this.state={
      uid:0,
      genres:[],
      gig:{}
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
  goBack(e){
    e.preventDefault();
    hashHistory.goBack();
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
   makeSets(e){
     e.preventDefault();
     let gigtitle = this.refs.gigtitle.value;
     let maxminutes = this.refs.maxminutes.value;
     let genresdesired = this.state.genres;
     let setsdesired = this.refs.setsdesired.value;
     if(!gigtitle || !maxminutes || !genresdesired || !setsdesired){
       alert("All fields must be entered");
       return null;
     }
     console.log('Gig title: ',gigtitle);
     console.log('max time: ',maxminutes);
     console.log('genres desired: ',genresdesired);
     console.log('sets desired: ',setsdesired);
     this.updateGig(gigtitle,maxminutes,genresdesired,setsdesired);
   }
   updateGig(title,minutes,genres,sets){
     var newgig={
       title:title,
       genres:genres,
       sets:sets,
       maxminutes:minutes
     };
     this.setState({
       gig:newgig
     });
   }
   testValue(x,array){
     for(let i=0; i<array.length; i++){
       if(x==array[i]){
         return true;
       }
     }
     return false;
   }
   removeValue(x,array){
     for(let i=0; i<array.length; i++){
       if(x==array[i]){
         array.splice(i,1);
       }
     }
   }
   addGenre(e){
     e.preventDefault();
     // e.target == document.querySelector(), $('').text()
     let genre = e.target.id;
     let current_genres = this.state.genres;
         //loop through array and test if genre is already there
         //if yes, remove it:
        if(this.testValue(genre,current_genres)){
          this.removeValue(genre,current_genres);
        }else{
         //if no, push it to genres:
         current_genres.push(genre);
         console.log('current genres: ',current_genres);
         this.setState({
           genres:current_genres
         });
        }
     //update the current genres array in state:
     this.setState({
       genres:current_genres
     });
     //display the current genres user has selected in the input
     current_genres = current_genres.join(', ');
     this.refs.genresdesired.value=current_genres;
   }
   previewGig(e){
     e.preventDefault();
     this.
     console.log(this.state.gig)
   }

  render(){

    const songs = (this.state.songs) ? this.state.songs.map(song => {
          return <SongButton songObject={ song } /> }) : '';
          console.log('songz: ',songs);

    return(
      <div className="wrapper container">

        <div className="row">
          {/* <div className="col-sm-2 hidden-xs"></div> */}
            <div className="col-sm-6">

              <form className="gig-form form form-default" action="#" >
                <h2>Create a Gig</h2>
                <div className="form-group">
                  <label for="title-input">Gig Name</label>
                  <input id="title-input" ref="gigtitle" type="text" className="form-control">

                  </input>
                  <label for="set-input">Sets Desired</label>
                  <input id="set-input" ref="setsdesired" type="number" placeholder="enter a number here" className="form-control"></input>
                  <label for="maxmin-input">Max Minutes</label>
                  <input id="maxmin-input" ref="maxminutes" type="number" placeholder="enter a number here" className="form-control"></input>
                  {/* <label for="lyrics-input">Songs</label>
                  {songs} */}
                </div>

                <div className="form-group genres">
                  <label for="genre-input">Genres Desired</label>
                  <input className="form-control" ref="genresdesired" type="text" placeholder="click genres below" id="add-genre"></input>
                  <div className="form-group add-genres">


                  </div>
                  <button ref="genre" id="blues" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs" >Blues</button>
                  <button ref="genre" id="slow" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Slow</button>
                  <button ref="genre" id="funk" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Funk</button>
                  <button ref="genre" id="sublime" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Sublime</button>
                  <button ref="genre" id="alternative" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Alternative</button>
                  <button ref="genre" id="other" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Other</button>
                </div>
                <div className="form-group">
                  <button type="submit" onClick={this.makeSets.bind(this)} className="btn btn-primary">Submit</button>
                  <button type="submit" onClick={this.goBack.bind(this)} className="btn btn-primary">Go Back</button>
                  <button type="submit" onClick={this.previewGig.bind(this)} className="btn btn-primary">Preview</button>
                </div>
              </form>

            </div>
            <div className="col-sm-6">
              <h2>Gig Preview</h2>
            </div>
          {/* <div className="col-sm-2 hidden-xs"></div> */}
        </div>
      </div>
    );
  }
}


export default GigForm;
