import React, { Component } from 'react';
import GigItem from './GigItem';
import { firebaseListToArray } from 'firebase';

class GigList extends Component{
  showSong(e){
    console.log('showing the song')
    this.props.showSong(e.target)
  }
  render(){
    let { gigSongArray,songs,maxsets,editButton,deleteButton,songmanage,type} = this.props;
    let frame = [];
    for(let setnum=1; setnum<=maxsets; setnum++){
      let songsInSet=[];
      gigSongArray = gigSongArray.sort((songa,songb)=>songa.set>songb.set)
      console.log(`gigSongArray: ${gigSongArray}`)
      for (var i =0; i<gigSongArray.length; i++) {
        console.log('gigsong set: ',gigSongArray[i].set,' setnum: ',setnum)
          if(gigSongArray[i].set==setnum){
            let tune = gigSongArray[i];

            songsInSet.push(
              <div className="gig-item-contain">
              <a href="#"><li onClick={this.showSong.bind(this)} id={tune.id}>{tune.title}</li></a>
                {songmanage && (
                  <div className="gig-item">{deleteButton} {editButton}</div>
                )}
              </div>
            );
          }
      }
    frame.push(
        <div className="set">
          <h3>Set {setnum}</h3>
          <ul>
            {songsInSet}
          </ul>
        </div>
      );
      console.log('setnum: ',setnum, '  maxsets: ',maxsets)
    }
    return(
      <div>{frame}</div>
    );
  }

}

export default GigList;
