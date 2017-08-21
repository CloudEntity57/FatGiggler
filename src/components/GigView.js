import React, { Component } from 'react';
import  moment from 'moment';

class GigView extends Component{

  editSongs(e){
    e.preventDefault();
    this.props.editSongs();
  }
  render(){
    let totalSongs=(tunes)=>{
      let gigtime = [];

     //  console.log('zero time is: ',gigtime);
       let results=0;
      for (let i=0; i<tunes.length; i++){
        let timeval = tunes[i].time;
       //  console.log('timeval is: ',timeval);
         gigtime.push(timeval);
         results+=timeval
      }
      return results;
    }


    console.log('songs: ',this.props.songs);
    // let total = this.props.time;
    let total = totalSongs(this.props.songs);

    let temp = moment.duration(total);
    let final;
    if(temp.hours()>0){
      final = temp.hours() + ' hr ' + temp.minutes() + ' min '+ temp.seconds()+' sec';
    }else{
      final = temp.minutes() + ' min '+ temp.seconds()+' sec';
    }
    return(
      <div>
      <div className="gig-buttons">
      <button onClick={this.props.playGig} id={this.props.id} className="btn btn-primary">Play</button>
      {/* <button onClick={this.editSongs.bind(this)} id={this.props.id} className="btn btn-primary">Edit</button> */}
      <button onClick={this.props.done} className="btn btn-primary hidden-sm hidden-md hidden-lg">Done</button>
      </div>
      <div className="gigtime"><h1>{this.props.title}</h1></div>
      <div className="gigtime">Est. time: {final}</div>
      <ul>
        { this.props.frame }
      </ul>
    </div>
    )
  }
}

export default GigView;
