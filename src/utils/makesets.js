
import moment from 'moment';
import {firebase} from 'firebase';
import jQuery from 'jquery';

const makesets = {

  //=====================GIG CREATION FUNCTIONS==========================

  shuffle: (array)=>{
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
 },

  filterByMood:(songs,feels)=>{
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
   },

  sortByTime:(songs,maxtime)=>{
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

    //  test = moment(test).format("m:ss");
    let test = total;
    test = moment(test).format("m:ss");
    console.log('TOTAL: ',test);
     return songs;
     // songs.forEach((val)=>{
     //   console.log('songs: ',val.title,',',val.length);
     // });
   },

  filterBySets: (songs,numsets)=>{
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
   },

   //=====================GIG DISPLAY FUNCTIONS==========================

   makeSets: (e)=>{
     e.preventDefault();
     let gigtitle = this.refs.gigtitle.value;
     let maxminutes = this.refs.maxminutes.value;
     //format in moment.js
     maxminutes = moment.duration(maxminutes+':00')._milliseconds;
     console.log('the maximum number of minutes allowed:',maxminutes);
     //
     let genresdesired = this.state.genres;
     let setsdesired = this.refs.setsdesired.value;
     if(!gigtitle || !maxminutes || !genresdesired || !setsdesired){
       alert("All fields must be entered");
       return null;
     }

     this.updateGig(gigtitle,maxminutes,genresdesired,setsdesired);

   },
   updateGig: (songs,title,minutes,genres,sets)=>{
     let moodfiltered = this.filterByMood(songs,genres);
     console.log('after mood filter:',moodfiltered);
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
  //  this.setState({
  //    genres:[]
  //  });
},
   previewGig: ()=>{
    //  console.log('current gig: ',this.state.gig);
     this.setState({
       show:true
     });
   },
   submitGig: (e)=>{
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


}

module.exports = makesets;
