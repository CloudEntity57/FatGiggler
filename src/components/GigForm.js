import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import moment from 'moment';
import jQuery from 'jquery';
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
     function compare(vibes,moods,song){
       for(let n=0; n<vibes.length; n++){
         //to each mood in song:
         for(let i=0; i<moods.length; i++){
           //add the song to results if its mood matches
           if(moods[i]===vibes[n]){
             results.push(song);
             return null;
           }
         }
       }
     }
     //go through each song:
     songs.forEach((val) =>{
       // console.log('val: ',val);
       //compare each genre in form:
       compare(feels,val.moods,val);

     });
    //  console.log('results',results);
     return results;
   }

  sortByTime(songs,maxtime){
    //  songs.forEach((val)=>{
    //    console.log('songs: ',val.title,',',val.time);
    //  });
    console.log('maxtime is: ',maxtime);
    // let max = moment.(maxtime).format('m:ss');
    console.log('max in minutes: ',maxtime);
     let totalSongs=(tunes)=>{
       let gigtime = [];

      //  console.log('zero time is: ',gigtime);
        let results=0;
       for (let i=0; i<tunes.length; i++){
        //  console.log('this time: ',tunes[i].time);
        //  let timeval = moment.duration(tunes[i].time)._milliseconds;
         let timeval = tunes[i].time;
        //  console.log('timeval is: ',timeval);
          gigtime.push(timeval);
          results+=timeval
       }
      //  console.log('the total added time: ',results);
      //   let results = 0;
      //  for(let i=0; i<gigtime.length; i++){
      //    let amt = moment(gigtime[i]).format("m:ss");
      //    console.log('this song is ',amt,' minutes long');
      //    results+=gigtime[i];
      //  }
       return results;
     }
     let total = totalSongs(songs);
    //  console.log('the TOTAL: ',total);
     while(total-maxtime > 250000){
      //  console.log('popping song!');
       songs.pop();
       total = totalSongs(songs);
     }

    //  test = moment(test).format("m:ss");

    console.log('TOTAL MILLISECS: ',total);
    let temp = moment.duration(total);
    let final;
    if(temp.hours()>0){
      final = temp.hours() + ' hr ' + temp.minutes() + ' min '+ temp.seconds()+' sec';
    }else{
      final = temp.minutes() + ' min '+ temp.seconds()+' sec';
    }
    // console.log('TOTAL: ',final);
    // this.setState({
    //   gigtime:final
    // });
     return songs;
     // songs.forEach((val)=>{
     //   console.log('songs: ',val.title,',',val.length);
     // });
   }
//ORIGINAL FILTER BY SETS:
  // filterBySets(songs,numsets){
  //   let setlen=songs.length/numsets;
  //     let results={};
  //
  //     for(let i=0; i<numsets; i++){
  //       results[i]=[];
  //       for(let x=0; x<setlen; x++){
  //         let song = songs.pop();
  //         if (song){
  //           results[i].push(song);
  //         }
  //       }
  //
  //     }
  //     // console.log('sets: ',results);
  //     return results;
  //  }

//EXPERIMENTAL FILTER BY SETS attempting to group all songs in single array with their set numbers attached to them
  filterBySets(songs,numsets){
    let setlen=Math.floor(songs.length/numsets);
    console.log('set length: ',setlen);
    let results = [];
      for(let i=1; i<=numsets; i++){
        for(let x=0; x<setlen; x++){
          let song = songs.pop();
          if (song){
            song.set=i;
            results.push(song);
          }
        }

      }
      console.log('sets: ',results);

      let totalSongs=(tunes)=>{
        let gigtime = [];

       //  console.log('zero time is: ',gigtime);
         let results=0;
        for (let i=0; i<tunes.length; i++){
         //  console.log('this time: ',tunes[i].time);
         //  let timeval = moment.duration(tunes[i].time)._milliseconds;
          let timeval = tunes[i].time;
         //  console.log('timeval is: ',timeval);
           gigtime.push(timeval);
           results+=timeval
        }
       //  console.log('the total added time: ',results);
       //   let results = 0;
       //  for(let i=0; i<gigtime.length; i++){
       //    let amt = moment(gigtime[i]).format("m:ss");
       //    console.log('this song is ',amt,' minutes long');
       //    results+=gigtime[i];
       //  }
        return results;
      }

      let total = totalSongs(results);

      let temp = moment.duration(total);
      let final;
      if(temp.hours()>0){
        final = temp.hours() + ' hr ' + temp.minutes() + ' min '+ temp.seconds()+' sec';
      }else{
        final = temp.minutes() + ' min '+ temp.seconds()+' sec';
      }
      console.log('TOTAL: ',final);
      this.setState({
        gigtime:final
      });

      return results;
   }

   //=====================GIG DISPLAY FUNCTIONS==========================

   makeSets(e){
     e.preventDefault();
     let gigtitle = this.refs.gigtitle.value;
     let maxminutes = this.refs.maxminutes.value;
     let maxhrs;
     if(maxminutes>60){
       maxhrs = 0;
       while(maxminutes>60){
         maxminutes = maxminutes-60;
         maxhrs++;
       }
       maxhrs = moment.duration({hours:maxhrs})._milliseconds;
       console.log('maxhours value entered by user: ',maxhrs);
     }
     //format in moment.js

     console.log('maxminutes value entered by user: ',maxminutes);
     maxminutes = moment.duration({minutes:maxminutes})._milliseconds;
     let max;
     if(maxhrs){
       max = maxminutes + maxhrs;
     }else{
       max = maxminutes;
     }
     console.log('the max minutes converted to millisecs using duration:',max);
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
     this.updateGig(gigtitle,max,genresdesired,setsdesired);

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
       setnum:sets,
       maxminutes:minutes
     };
     this.setState({
       gig:newgig
     },
     this.previewGig
   );
  //  this.setState({
  //    genres:[]
  //  });
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
     jQuery('.form-control').val('');
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
    console.log('the gig is: ',this.state.gig);
    let maxsets = parseInt(this.state.gig.setnum);
    console.log('max sets: ',maxsets);
    let setnum=1;
    let sets = this.state.gig.sets
    console.log('the sets are: ',sets);

    if(sets){


      //go through for each set:
      for(let x=0; x<maxsets; x++){
        let  goods=[];
        // go through every song in the gig:
        for (var song =0; song<sets.length; song++) {
          // console.log('the song to iterate through: ',sets[song]);
          if (sets.hasOwnProperty(song)) {
          // check if song has current gig number
            if(sets[song].set===setnum){
              console.log('yes its running');
              //create the ESX for that set
              goods.push(<li>{sets[song].title}</li>);

            }
          }
        }
        frame.push(
          <div>
          <h3>Set {setnum}</h3>
          <ul>
            {goods}
          </ul>
        </div>
        );
        //increase the set number
        setnum++;
      }



    }
    const gigInfo = (this.state.show) ? (
      <div className="gig-info">
      <div className="gig-preview-header">
        <div className="gig-preview-title">{this.state.gig.title}</div>
        <div className="gig-est-time">{this.state.gigtime}</div>
      </div>
      <ul>
        { frame }
      </ul>
    </div>
    ) :'';
    return(
      <div className="wrapper container landed_content">

        <div className="row">
          {/* <div className="col-sm-2 hidden-xs"></div> */}
            <div className="gig-form-container col-sm-6">
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
                  <button id="rock" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Rock</button>
                  <button id="alternative" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Alternative</button>
                  <button id="jazz" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Jazz</button>
                  <button id="rnb" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Hip Hop/R&B</button>
                  <button id="rap" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Rap</button>
                  <button id="soul" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Soul</button>
                  <button id="other" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Other</button>
                </div>
                </div>
                <div className="form-group submit-buttons">
                  <button type="submit" onClick={this.makeSets.bind(this)} className="btn btn btn-primary">Preview</button>
                  <button type="submit" onClick={this.submitGig.bind(this)} className="btn btn-primary">Submit</button>
                  <button type="submit" onClick={this.goBack.bind(this)} className="btn btn-primary">Go Back</button>

                </div>
              </form>

            </div>
            <div className="gig-preview col-sm-6">
              <div className="gig-cover"></div>
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
