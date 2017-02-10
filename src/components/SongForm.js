import React, { Component } from 'react';
import { firebase } from '../utils/firebase';
import { hashHistory } from 'react-router';
import moment from 'moment';
import jQuery from 'jquery';


class SongForm extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0,
      genres:[]
    }
  }
  componentDidMount(){
    const user = firebase.auth().currentUser;
    console.log('current user: ',user);
    const uid = user.uid;
    const username = user.displayName;
    const userpic = user.photoURL;
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
    if(!title || !artist || !lyrics || !moods){
      alert("All fields must be entered");
      return null;
    }
    //handle parsing of time
    let minutes =this.refs.minutes.value;
    let seconds =this.refs.seconds.value;
    minutes = moment.duration('00:'+minutes+':00');
    seconds = moment.duration('00:00:'+seconds);
    let time= minutes+seconds;
    time= moment(time).format("m:ss");
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
      moods:moods
    }).then((data)=>{
      // console.log('success!',data);
      jQuery('.form-control').val('');
      jQuery('.time-enter').val('');
      this.setState({
        genres:[]
      });

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

  render(){
    let lnk = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTuXHksRLoduQ-_f8EGSEIsvCCIXKgtEhpQHm-Y3pTMrK5I86kD";
    let image = (<img className="img-responsive" src={lnk} />);
    return(
      <div>
        <div className="row">
          <div className="col-sm-1 col-md-2 hidden-xs"></div>
            <div className="col-sm-10 col-md-8">
              <form className="song-form form form-default" action="#" >
                <h1>Add a Song</h1>
                <div className="form-group">
                  <div className="row">
                    <div className="col-xs-6">
                    <div className="col-sm-12">
                      <label for="title-input">Song Title</label>
                      <input id="title-input" ref="songtitle" placeholder="Add song title" type="text" className="form-control">

                      </input>
                    </div>
                    <div className="col-sm-12">
                      <label for="artist-input">Artist</label>
                      <input id="artist-input" ref="artist" placeholder="Add artist" type="text" className="form-control">
                      </input>
                    </div>
                    <div className="col-sm-12">
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
                <div className="form-group row">
                  <div className="col-sm-12">
                  <label for="lyrics-input">Lyrics</label>
                  <textarea id="lyrics-input" placeholder="Add lyrics" ref="lyrics" type="text" className="form-control">
                  </textarea>
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
      </div>
    );
  }
}

export default SongForm;
