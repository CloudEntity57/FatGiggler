  let MakeSet = {

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
 },

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

 }
 export default MakeSet;
