import React, { Component } from 'react';
import Song from './Song';
import { firebase } from '../utils/firebase';
import {renderGig} from '../services/gigsService';
import GigList from './gig-components/GigList';
import HttpService from '../services/http';
import { fetchGigSongs } from '../services/gigsService';

class SetList extends Component {
  constructor(props){
    super(props);
    this.state={
      isplaying:false,
      uid:this.props.id,
      gig:{}
    }
    this.http = new HttpService();
  }
  componentDidMount(){
    let theGig=this.props.gig;
    // console.log('setlist CWM sets: ',theSets);
    this.setState({
      gig:theGig
    });
    this.config();
    // console.log('the SetList gig: ',this.state.gig);
  }
  handleClick(target){
    const id = target.id;
    console.log('id in setlist: ',id);
    this.props.scroll(id);
    this.setState({
      playing:id,
      isplaying:true
    });
  }
  displaySongs(){
    this.setState({
      isplaying:false
    });
  }
  config(){
    let gig = this.props.gig;
      // console.log('the gig in SetList.js: ',gig);
    let frame=[];
    let setnum=1;
    let maxsets = parseInt(gig.setnum);
    console.log('maxsets: ',maxsets);
    //const setInfo = gig.sets.then((res)=>console.log('LOGGIN ',res));
    console.log('GIGSETS - ',gig.sets)
    //create an array of the latest songs from the database:
    let songs = gig.sets;
    let uid = this.state.uid;

    console.log('the songs are: ',songs);
    if(songs.length===0){
      songs=this.props.songs;
    }

    let gigListData = {
      songs,
      gigSongArray:songs,
      maxsets,
      showSong:this.handleClick.bind(this),
      type:'dashboard'
    }
    const gigInfo = (
      <div>
      <h1>{this.state.gig.title}</h1>
      <ul>
        { <GigList {...gigListData }/> }
      </ul>
    </div>
    );
    let songplaying = this.state.playing
    console.log('playing: ',songplaying);
    let html = (this.state.isplaying) ? (<div className="hidden-sm hidden-md hidden-lg"><Song cancel={this.displaySongs.bind(this)} id={this.state.uid} song={songplaying}/></div>)
     : '';
    this.setState({
      gigDisplay:(
      <div className="col-sm-6 set_list">
        {html}
        { gigInfo }
      </div>
      )
    });
  }
  render(){
    const { gigDisplay } = this.state;



    return(
      <div>
      { gigDisplay }
      </div>
    )

  }
}


export default SetList;
