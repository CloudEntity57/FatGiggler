import React, { Component } from 'react';
import  moment from 'moment';

class GigView extends Component{

  constructor(props){
    super(props);
  }
  editSongs(e){
    e.preventDefault();
    this.props.editSongs();
  }
  totalSongs(songs){
    let gigtime = [];

   //  console.log('zero time is: ',gigtime);
     let results=0;
     for (let i=0; i<songs.length; i++){
      let timeval = songs[i].time;
    console.log('timeval is: ',timeval);
       gigtime.push(timeval);
       results+=timeval
    }
    return results;
  }
  render(){

    const { songs, playGig, done, title, frame, id } = this.props;

    console.log('props: ',this.props);
    // let total = this.props.time;
    let total = this.totalSongs(songs);

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
      <button onClick={playGig} id={id} className="btn btn-primary">Play</button>
      {/* <button onClick={this.editSongs.bind(this)} id={this.props.id} className="btn btn-primary">Edit</button> */}
      <button onClick={done} className="btn btn-primary hidden-sm hidden-md hidden-lg">Done</button>
      </div>
      <div className="gigtime"><h1>{title}</h1></div>
      <div className="gigtime">Est. time: {final}</div>
        { frame }
    </div>
    )
  }
}

export default GigView;
