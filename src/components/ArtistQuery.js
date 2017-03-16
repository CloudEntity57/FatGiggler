import jquery from 'jquery';
import cors from 'cors';
import Firebase from '../utils/firebase';

let findLyrics = (query)=>{
  let musix = process.env.REACT_APP_MUSIX_APP_API;
  let song_htmlstring = query.replace(/ /g,'%20');
  ('my api key: ',musix);
  console.log('song_htmlstring: ',song_htmlstring);


  let api_top10_search_str = "https://api.musixmatch.com/ws/1.1/track.search?apikey="+musix+"&q_track="+song_htmlstring+"&page_size=10&page=1&s_track_rating=desc";
  // console.log('search string: ',api_top10_search_str);

  // Get a database reference to our posts
  var ref = new Firebase(api_top10_search_str);
  // Attach an asynchronous callback to read the data at our posts reference
  ref.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
// // console.log('modified array: ',artists_query_array);
// let result_array = [];
//
//   let request = jquery.ajax({
//     headers:{
//       'Access-Control-Allow-Origin': '*'
//     },
//     url:api_top10_search_str,
//     method:'GET'
//   });
//   request.done((val)=>{
//     var output = JSON.parse(val);
//     console.log('we are getting for output: ',output.message.body.track_list);
    // result_array.push(output.message.body.track_list);
    //     if(result_array.length === artists.length){
    //       console.log('result arrays length: ',result_array.length);
    //       console.log('result array: ',result_array);
    //       for(let i=0; i<result_array.length; i++){
    //         console.log('result_array item: ',result_array[i]);
    //       // go through every song in the list
    //         for(let n=0; n<result_array[i].length; n++){
    //       // for each song save the title, artist, length, lyrics and genres inside an object identical to song database
    //           let mysong = result_array[i][n];
    //           console.log('my song: ',mysong);
    //           let songObject = {};
    //           songObject.title = mysong.track.track_name;
    //           songObject.artist = mysong.track.artist_name;
    //           songObject.trackid = mysong.track.track_id;
    //           defaultsongs.push(songObject);
    //       // push that object to the default song array and set the default state to that array
    //         }
    //       //pass those songs to the two dashboard components for display
    //       }
    //       console.log('default songs: ',defaultsongs);
    //       this.setState({
    //         defaultsongs:defaultsongs
    //       });
    //     }
  // });
  // request.fail((error)=>{console.log('fail!! error: ',error);});

}

export { findLyrics };
