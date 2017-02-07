import React, { Component } from 'react';
import { firebase } from '../utils/firebase';
import { hashHistory } from 'react-router';


class SongForm extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0
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
  handleClick(e){
    e.preventDefault();
    const title = this.refs.songtitle.value;
    const artist = this.refs.artist.value;
    const lyrics = this.refs.lyrics.value;
    console.log('title: ',title);
    const uid = this.state.uid;
    firebase.database()
    .ref('/'+uid+'/songs')
    .push({
      title:title,
      artist:artist,
      lyrics:lyrics
    }).then((data)=>{
      console.log('success!',data);
    });
  }
  render(){
    return(
      <div>
        <div className="row">
          <div className="col-sm-2 hidden-xs"></div>
            <div className="col-sm-8">
              <form className="song-form form form-default" action="#" >
                <h1>Add a Song</h1>
                <div className="form-group">
                  <label for="title-input">Song Title</label>
                  <input id="title-input" ref="songtitle" type="text" className="form-control">

                  </input>
                  <label for="artist-input">Artist</label>
                  <input id="artist-input" ref="artist" type="text" className="form-control">

                  </input>

                  <label for="lyrics-input">Lyrics</label>
                  <textarea id="lyrics-input" ref="lyrics" type="text" className="form-control">
                  </textarea>
                </div>

                <div className="form-group genres">
                  <div className="form-group add-genres">
                    <input className="form-control" type="text" placeholder="Add a Genre" id="add-genre"></input>
                    <button className="btn btn-primary">Add</button>
                  </div>
                  <button className="btn btn-primary btn-xs">Blues</button>
                  <button className="btn btn-primary btn-xs">Slow</button>
                  <button className="btn btn-primary btn-xs">Funk</button>
                  <button className="btn btn-primary btn-xs">Sublime</button>
                  <button className="btn btn-primary btn-xs">Alternative</button>
                </div>
                <div className="form-group">
                  <button type="submit" onClick={this.handleClick.bind(this)} className="btn btn-primary">Submit</button>
                  <button type="submit" onClick={this.goBack.bind(this)} className="btn btn-primary">Done</button>
                </div>
              </form>
            </div>
          <div className="col-sm-2 hidden-xs"></div>
        </div>
      </div>
    );
  }
}

export default SongForm;
