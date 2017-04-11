module.exports = {
  musixMatch:()=>{
  console.log('the set playing in app is: ',this.props.playing);
  findLyrics('bob dylan the times they are a changing');
    // ----====================MUSIXMATCH API CONNECTION TEST======================================//

      let musix = process.env.REACT_APP_MUSIX_APP_API;
      console.log('my api key is: ',musix);

      // let artists = [
      //   "bob dylan",
      //   "jeff buckley",
      //   "ed sheeran",
      //   "bruno mars",
      //   "leonard cohen",
      //   "B.B. King",
      //   "grateful dead",
      //   "beatles",
      //   "elvis presley",
      //   "ray charles",
      //   "stevie wonder",
      //   "steely dan",
      //   "david bowie",
      //   "prince",
      //   "frank sinatra",
      //   "aretha franklin",
      //   "tori amos"
      // ];
      let artists = [
        "bob dylan"
       ];
      let artists_htmlstring= artists.map((val)=>{
        var mod = val.replace(/ /g,'%20');
        return mod;
      });

      let artists_query_array = artists_htmlstring.map((val)=>{
        let api_top10_search_str = "http://api.musixmatch.com/ws/1.1/track.search?apikey="+musix+"&q_artist="+val+"&page_size=10&page=1&s_track_rating=desc";
        // console.log('search string: ',api_top10_search_str);
        return api_top10_search_str;
      });
      // console.log('modified array: ',artists_query_array);
      let result_array = [];
      let defaultsongs = [];
      for(let i=0; i<artists_query_array.length; i++){
        jquery.get(artists_query_array[i],(val)=>{
          var output = JSON.parse(val);
          console.log('we are getting for output: ',output.message.body.track_list);
          result_array.push(output.message.body.track_list);
              if(result_array.length === artists.length){
                console.log('result arrays length: ',result_array.length);
                console.log('result array: ',result_array);
                for(let i=0; i<result_array.length; i++){
                  console.log('result_array item: ',result_array[i]);
                // go through every song in the list
                  for(let n=0; n<result_array[i].length; n++){
                // for each song save the title, artist, length, lyrics and genres inside an object identical to song database
                    let mysong = result_array[i][n];
                    console.log('my song: ',mysong);
                    let songObject = {};
                    songObject.title = mysong.track.track_name;
                    songObject.artist = mysong.track.artist_name;
                    songObject.trackid = mysong.track.track_id;
                    defaultsongs.push(songObject);
                // push that object to the default song array and set the default state to that array
                  }
                //pass those songs to the two dashboard components for display
                }
                console.log('default songs: ',defaultsongs);
                this.setState({
                  defaultsongs:defaultsongs
                });
              }
        });
      }



      //
      // create default gig for user from the site's default artist database

    //   let defaultgig={
    //     title:'My Gig',
    //     genres:this.state.genres,
    //     sets:setfiltered,
    //     maxminutes:216000000
    //   };
    //
    //
    // ===================================//
  }
};
