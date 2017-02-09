import React, { Component } from 'react';
import { firebase } from '../utils/firebase';
import { hashHistory } from 'react-router';
import moment from 'moment';


class SongForm extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0,
      genres:[]
    }
  }
  componentDidMount(){
    const uid = firebase.auth().currentUser.uid;
    this.setState({
      uid:uid
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
  render(){
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
                      <input id="title-input" ref="songtitle" type="text" className="form-control">

                      </input>
                    </div>
                    <div className="col-sm-12">
                      <label for="artist-input">Artist</label>
                      <input id="artist-input" ref="artist" type="text" className="form-control">
                      </input>
                    </div>
                    <div className="col-sm-12 time-entry">
                      <input id="minutes" ref="minutes" placeholder="min" type="number" ></input>
                      <input id="seconds" ref="seconds" placeholder="sec" type="number" ></input>
                    </div>
                  </div>
                  <div className="col-xs-6">
                    <img />
                  </div>
                  </div>

                </div>

                <div className="form-group clearfix">

                </div>
                <div className="form-group">
                  <label for="lyrics-input">Lyrics</label>
                  <textarea id="lyrics-input" ref="lyrics" type="text" className="form-control">
                  </textarea>
                </div>

                <div className="form-group genres">
                  <div className="form-group add-genres">
                    <input ref="genresdesired" className="form-control" type="text" placeholder="Add a Genre" id="add-genre"></input>
                  </div>
                  <button id="blues" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Blues</button>
                  <button id="slow" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Slow</button>
                  <button id="upbeat" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Upbeat</button>
                  <button id="funk" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Funk</button>
                  <button id="sublime" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Sublime</button>
                  <button id="alternative" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Alternative</button>
                  <button id="other" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Other</button>
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
