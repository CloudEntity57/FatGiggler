import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import moment from 'moment';

import SongButton from './SongButton';

class GigForm extends Component {
  constructor(props){
    super(props);
    this.state={
      uid:0,
      genres:[],
      gig:{},
      show:false
    }
  }
  componentWillMount(){
  //
    firebase.auth().onAuthStateChanged(
      user => {
        let uid=0;
        if(user){
          // console.log('uid: ',user.uid);
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
                  // console.log('the Dash CWM songs: ',this.state.songs);
                });
        }else{
          hashHistory.push('/');
        }

      });

  }


  //=====================GIG CREATION FUNCTIONS==========================


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
     let vibes = feels;
     let results = [];
     //go through each song:
     songs.forEach((val) =>{
       // console.log('val: ',val);
       //compare each genre in form:
       vibes.forEach((feel) =>{
          //compare to each genre in song mood(s):
          // console.log('this songs moods are: ',val.moods);
           val.moods.forEach((foo)=>{
              //if song mood = form genre
               if(foo==feel){
                //  console.log('feeling match song is: ',val.title,',',val.id);
                 results.push(val);
               }

           });

       });

     });

    //  console.log('results',results);
     return results;
   }

  sortByTime(songs,maxtime){
    //  songs.forEach((val)=>{
    //    console.log('songs: ',val.title,',',val.time);
    //  });
     let gigtime = [];

    //  console.log('zero time is: ',gigtime);

     for (let i=0; i<songs.length; i++){
       let timeval = moment.duration(songs[i].time)._milliseconds;
      //  console.log('timeval is: ',timeval);
        gigtime.push(timeval);
     }
    //  console.log('the total added time: ',gigtime);
     let total=0;
     for(let i=0; i<gigtime.length; i++){
       total+=gigtime[i];
     }
    //  console.log('the TOTAL: ',total);
     while(total-maxtime > 5){
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
      // console.log('sets: ',results);
      return results;
   }

   //=====================GIG DISPLAY FUNCTIONS==========================

   makeSets(e){
     e.preventDefault();
     let gigtitle = this.refs.gigtitle.value;
     let maxminutes = this.refs.maxminutes.value;
     //format in moment.js
     maxminutes = moment.duration(maxminutes+':00')._milliseconds;
    //  console.log('the maximum number of minutes allowed:',maxminutes);
     //
     let genresdesired = this.state.genres;
     let setsdesired = this.refs.setsdesired.value;
     if(!gigtitle || !maxminutes || !genresdesired || !setsdesired){
       alert("All fields must be entered");
       return null;
     }
    //  console.log('Gig title: ',gigtitle);
    //  console.log('max time: ',maxminutes);
    //  console.log('genres desired: ',genresdesired);
    //  console.log('sets desired: ',setsdesired);
     this.updateGig(gigtitle,maxminutes,genresdesired,setsdesired);
   }
   updateGig(title,minutes,genres,sets){

    //  let results = this.shuffle(this.state.songs);
    //  console.log('shuffled results are: ',results);
    //  console.log('the current genres in state are: ',this.state.genres);
    //  console.log('the current songs in state are: ',this.state.songs);
     let moodfiltered = this.filterByMood(this.state.songs,this.state.genres);
    //  console.log('after mood filter:',moodfiltered);
     let timefiltered = this.sortByTime(moodfiltered,minutes);
    //  console.log('after time filter: ',timefiltered);
     let setfiltered = this.filterBySets(timefiltered,sets);
    //  console.log('after set filter: ',setfiltered);
     let newgig={
       title:title,
       genres:genres,
       sets:setfiltered,
       maxminutes:minutes
     };
     this.setState({
       gig:newgig
     },
     this.previewGig
   );

   }
   previewGig(){
    //  console.log('current gig: ',this.state.gig);
     this.setState({
       show:true
     });
   }
   submitGig(e){
     e.preventDefault();
     let uid = this.state.uid;
    //  console.log('aaaaand: ',uid);
    //  console.log('gig to firebase: ',this.state.gig);
     firebase.database()
     .ref('/'+uid+'/gigs')
     .push({
       gig:this.state.gig
     });
   }
   //==============================FORM FUNCTIONS=================

   goBack(e){
     e.preventDefault();
     hashHistory.goBack();
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
        //  console.log('current genres: ',current_genres);
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

  render(){

    const songs = (this.state.songs) ? this.state.songs.map(song => {
          return <SongButton songObject={ song } /> }) : '';
          // console.log('songz: ',songs);
    // var gigList = this.state.gig.map((val)=>{
    //   return (<li>val.</li>);
    // });
    let frame=[];
    let setnum=1;
    // console.log('our gig saved in state: ',this.state.gig);
    for (var property in this.state.gig.sets) {

    if (this.state.gig.sets.hasOwnProperty(property)) {
      let  goods=[];
      this.state.gig.sets[property].map((val)=>{
        // console.log('the setss song is: ',val);
        goods.push(<li>{val.title}</li>);
      });
        frame.push(
          <div>
          <h3>Set {setnum}</h3>
          <ul>
            {goods}
          </ul>
        </div>
        );
        setnum++;
        // console.log('html: ',html);

          // console.log('property is: ',property);
    }
}
    const gigInfo = (this.state.show) ? (
      <div>
      <h2>{this.state.gig.title}</h2>
      <ul>
        { frame }
      </ul>
    </div>
    ) :'';
    return(
      <div className="wrapper container">

        <div className="row">
          {/* <div className="col-sm-2 hidden-xs"></div> */}
            <div className="gig-form-container col-sm-6">
              <form className="gig-form form form-default" action="#" >
                <h2>Create a Gig</h2>
                <div className="form-group">
                  <label for="title-input">Gig Name</label>
                  <input id="title-input" ref="gigtitle" value="Fitzgerald's Gig" type="text" className="form-control">

                  </input>
                  <label for="set-input">Sets Desired</label>
                  <input id="set-input" ref="setsdesired" type="number" value="2" placeholder="enter a number here" className="form-control"></input>
                  <label for="maxmin-input">Max Minutes</label>
                  <input id="maxmin-input" ref="maxminutes" type="number" value = "45" placeholder="enter a number here" className="form-control"></input>
                  {/* <label for="lyrics-input">Songs</label>
                  {songs} */}
                </div>

                <div className="form-group">
                  <label for="genre-input">Genres Desired</label>
                  <input className="form-control" ref="genresdesired" type="text" placeholder="click genres below" id="add-genre"></input>
                  <div className="form-group add-genres">


                  </div>
                  <div className="buttons">
                  <button id="blues" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs" >Blues</button>
                  <button id="slow" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Slow</button>
                  <button id="upbeat" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Upbeat</button>
                  <button id="funk" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Funk</button>
                  <button id="sublime" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Sublime</button>
                  <button id="alternative" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Alternative</button>
                  <button id="other" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Other</button>
                </div>
                </div>
                <div className="form-group submit-buttons">
                  <button type="submit" onClick={this.makeSets.bind(this)} className="btn btn-sm btn-primary">Preview</button>
                  <button type="submit" onClick={this.submitGig.bind(this)} className="btn btn-primary">Submit</button>
                  <button type="submit" onClick={this.goBack.bind(this)} className="btn btn-primary">Go Back</button>

                </div>
              </form>

            </div>
            <div className="col-sm-6">
              <h2>Gig Preview</h2>
              { gigInfo }
            </div>
          {/* <div className="col-sm-2 hidden-xs"></div> */}
        </div>
      </div>
    );
  }
}


export default GigForm;
