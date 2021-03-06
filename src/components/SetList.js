import React, { Component } from 'react';
import Song from './Song';
import { firebase } from '../utils/firebase';
import {renderGig} from './NewUserFilter';

class SetList extends Component {
  constructor(props){
    super(props);
    this.state={
      isplaying:false,
      uid:this.props.id
    }
  }
  componentDidMount(){
    let theGig=this.props.gig;
    // console.log('setlist CWM sets: ',theSets);
    this.setState({
      gig:theGig
    });
    // console.log('the SetList gig: ',this.state.gig);
  }
  handleClick(e){
    e.preventDefault();
    let id = e.target.id;
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
  render(){
    let gigInfo = '';

    if(this.state.gig){
      let gig = this.props.gig;
      // console.log('the gig in SetList.js: ',gig);
        let frame=[];
        let setnum=1;
        let maxsets = parseInt(gig.setnum);
        console.log('maxsets: ',maxsets);
        let sets = gig.sets;

        // ========SET CREATION ALGORITHM BASED ON STORING SONGS IN SEPARATE SET ARRAYS:

        // console.log('our sets saved in state: ',this.state.sets);
        // for (var property in gig.sets) {
        //     if (gig.sets.hasOwnProperty(property)) {
        //       let  songs=[];
        //       gig.sets[property].map((val)=>{
        //         // console.log('the setss song is: ',val);
        //         songs.push(<a href="#" onClick={this.handleClick.bind(this)}><li id={val.id}>{val.title}</li></a>);
        //       });
        //         frame.push(
        //           <div className="set">
        //           <h3>Set {setnum}</h3>
        //           <ul>
        //             {songs}
        //           </ul>
        //         </div>
        //         );
        //         setnum++;
        //     }
        // }

        //======================SET CREATION ALGORITHM BASED ON STORING ALL SONGS IN THE SAME ARRAY=================================

        //Iterate once through the songs for each set:
        // for(let x=0; x<maxsets; x++){
        //   let  goods=[];
        //   // go through every song in the gig:
        //   for (var song =0; song<sets.length; song++) {
        //     // console.log('the song to iterate through: ',sets[song]);
        //     if (sets.hasOwnProperty(song)) {
        //     // check if song has current gig number
        //       if(sets[song].set===setnum){
        //         //create the ESX for that set
        //         // goods.push(<li>{sets[song].title}</li>);
        //         goods.push(<a href="#" onClick={this.handleClick.bind(this)}><li id={sets[song].id}>{sets[song].title}</li></a>);
        //
        //       }
        //     }
        //   }
        //create an array of the latest songs from the database:
        let songs = [];
        let uid = this.state.uid;
        sets.forEach((obj)=>{
          let id = obj.id;
          console.log('id: ',id);
          firebase.database()
          .ref(uid+'/songs/'+id)
          .on('value',(data)=>{
            let result=data.val();
            console.log('result: ',result);
            result.id=id;
            songs.push(result);
          });
        });
        console.log('the songs are: ',songs);
        if(songs.length===0){
          songs=this.props.songs;
        }

        //=======================================================
        let makeSet = (tune,goods)=>{
          goods.push(<a href="#" onClick={this.handleClick.bind(this)}><li id={tune.id}>{tune.title}</li></a>);
        }
        renderGig(sets,setnum,songs,maxsets,frame,makeSet);

        gigInfo = (
          <div>
          <h1>{this.state.gig.title}</h1>
          <ul>
            { frame }
          </ul>
        </div>
      );
    }
    let songplaying = this.state.playing
    console.log('playing: ',songplaying);
    let html = (this.state.isplaying) ? (<div className="hidden-sm hidden-md hidden-lg"><Song cancel={this.displaySongs.bind(this)} id={this.state.uid} song={songplaying}/></div>)
     : '';
    return(
    <div className="col-sm-6 set_list">

      {html}
      { gigInfo }
    </div>
    );

  }
}


export default SetList;
