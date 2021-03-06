import React, { Component } from 'react';
import { firebase } from '../utils/firebase';
import { hashHistory } from 'react-router';
import moment from 'moment';
import SubmitModal from './SubmitModal';
import jQuery from 'jquery';
import  xmltojson  from 'xmltojson';
console.log('xml: ',xmltojson);

class SongForm extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0,
      genres:[],
      submitted:false
    }
  }

  componentDidMount(){
    const user = firebase.auth().currentUser;
    console.log('current user: ',user);
    const uid = user.uid;
    const username = user.displayName;
    const userpic = user.photoURL;


    let result_array = [];
    let defaultsongs = [];
    // const username =
    this.setState({
      uid:uid,
      username:username,
      userpic:userpic
    });
  }
  goBack(e){
    e.preventDefault();
    hashHistory.goBack();
  }

    ///=====================FORM FUNCTIONS=======

  handleClick(e){
    e.preventDefault();
    const title = this.refs.songtitle.value;
    const artist = this.refs.artist.value;
    const lyrics = this.refs.lyrics.value;
    const moods = this.state.genres;
    const userpic = this.state.userpic;
    if(this.state.uid===0){
      this.setState({
        submitted:true,
        modaltext:'You gotta log in first.'
      });
      return;
    }
    if(!title || !artist || !lyrics || !moods){
      alert("All fields must be entered");
      return null;
    }
    let artistquery = artist;
    let titlequery = title;


    artistquery = artistquery.replace(/ /g,'%20');
    titlequery = titlequery.replace(/ /g,'%20');

    let spotify_str = "https://api.spotify.com/v1/search/?q="+artistquery+"%20"+titlequery+"&type=artist,track";
    // console.log('search string: ',api_top10_search_str);
    console.log('search string: ',spotify_str);
    let album_art;
    let pic = userpic;
    // jQuery.get(spotify_str,(val)=>{
      // var output = JSON.parse(val);
      // console.log('our list of album art: ',val);
      // if(val.tracks.items[0] != null){
      //   album_art = val.tracks.items[0].album.images[0].url;
      //   console.log('our album art: ',album_art);
      //   pic = album_art
      // }else{
      //   pic = userpic
      // }
  //========
    console.log('final pic is: ',pic);
    //
    //handle parsing of time
    let minutes =this.refs.minutes.value;
    let seconds =this.refs.seconds.value;
    minutes = moment.duration({minutes: minutes})._milliseconds;
    seconds = moment.duration({seconds: seconds})._milliseconds;
    let time= minutes+seconds;
    // time= moment(time).format("m:ss");
    // console.log('time2 is: ',time);
    //
    // console.log('moods: ',moods);
    const uid = this.state.uid;
    firebase.database()
    .ref('/'+uid+'/songs')
    .push({
      title:title,
      artist:artist,
      time:time,
      lyrics:lyrics,
      moods:moods,
      pic:pic
    }).then((data)=>{
      // console.log('success!',data);
      // jQuery('.form-control').val('');
      // jQuery('.time-enter').val('');
      this.setState({
        genres:[],
        submitted:true,
        modaltext:'Yeahh.'
      });
      jQuery('.form-control').val('');
      jQuery('.time-enter').val('');
    });
    // });
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
    // console.log('the genres: ',current_genres);
        //loop through array and test if genre is already there
        //if yes, remove it:
       if(this.testValue(genre,current_genres)){
         this.removeValue(genre,current_genres);
       }else{
        //if no, push it to genres:
        current_genres.push(genre);
        // console.log('current genres: ',current_genres);
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
  //================================
  picShow(files,e){
    // let imgurl=files[0].name;
    let imgurl=files[0];
    console.log('image url: ',imgurl);
    return(<img src={imgurl} />);
  }
  hideModal(){
    console.log('function called');
    this.setState({
      submitted:false
    });
  }
  searchLyrics(e){
    e.preventDefault();
    let title = this.refs.songtitle.value;
    let artist = this.refs.artist.value;
    const url = "http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist="+artist+'&song='+title;
    console.log(url);
    fetch(url).then(
      (val)=>{
        // val=xmltojson.parseString(val);
        console.log(val);
      }
    );
  }
  render(){
    let lnk = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTuXHksRLoduQ-_f8EGSEIsvCCIXKgtEhpQHm-Y3pTMrK5I86kD";
    let image = (<img className="img-responsive" src={lnk} />);
    let submitModal = (this.state.submitted) ? (<SubmitModal text={this.state.modaltext} hide={this.hideModal.bind(this)}/>) : '';
    // let submitModal = (<SubmitModal hide={this.hideModal.bind(this)}/>);
    return(
      <div>
        <div className="row">
          <div className="col-sm-1 col-md-2 hidden-xs"></div>
            <div className="wrapper container">
              <form className="song-form form form-default" action="#" >
                <h1>Add a Song</h1>
                <div className="form-group">
                  <div className="row">
                    <div className="col-xs-6">
                    <div>
                      <label for="title-input">Song Title</label>
                      <input id="title-input" ref="songtitle" placeholder="Add song title" type="text" className="form-control">

                      </input>
                    </div>
                    <div>
                      <label for="artist-input">Artist</label>
                      <input onKeyUp={this.searchLyrics.bind(this)} id="artist-input" ref="artist" placeholder="Add artist" type="text" className="form-control">
                      </input>
                    </div>
                    <div>
                    <label>Song Length</label>
                    </div>
                    <div className="col-sm-12 time-entry">
                      <input id="minutes" ref="minutes" placeholder="min" className="time-enter" type="number" ></input>
                      <input id="seconds" ref="seconds" placeholder="sec" className="time-enter" type="number" ></input>
                    </div>
                  </div>
                  <div className="col-xs-6">
                    { image }
                  </div>
                  </div>

                </div>

                <div className="form-group clearfix">

                </div>
                <div className="form-group">
                  <div className="row">
                  <div className="col-sm-12">
                    <label for="lyrics-input">Lyrics</label>
                    <textarea id="lyrics-input" placeholder="Add lyrics" ref="lyrics" type="text" className="form-control">
                    </textarea>
                  </div>
                </div>
                </div>

                <div className="form-group genres">
                  <div className="form-group add-genres">
                    <input ref="genresdesired" className="form-control" type="text" placeholder="Click genres below" id="add-genre"></input>
                  </div>
                  <button id="blues" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Blues</button>
                  <button id="slow" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Slow</button>
                  <button id="upbeat" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Upbeat</button>
                  <button id="funk" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Funk</button>
                  <button id="sublime" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Sublime</button>
                  <button id="alternative" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Alternative</button>
                  <button id="rock" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Rock</button>
                  <button id="folk" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Folk</button>
                  <button id="country" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Country</button>
                  <button id="jazz" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Jazz</button>
                  <button id="other" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Other</button>
                  <button id="rnb" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Hip Hop/R&B</button>
                  <button id="rap" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Rap</button>
                  <button id="soul" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Soul</button>
                </div>
                <div className="form-group">
                  <button type="submit" onClick={this.handleClick.bind(this)} className="btn btn-primary">Submit</button>
                  <button type="submit" onClick={this.goBack.bind(this)} className="btn btn-primary">Go Back</button>
                </div>
              </form>
            </div>
          <div className="col-sm-1 col-md-2 hidden-xs"></div>
        </div>
        {submitModal}
      </div>
    );
  }
}

export default SongForm;
