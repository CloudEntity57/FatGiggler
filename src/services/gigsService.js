import React from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import HttpService from '../services/http';

const http = new HttpService();

module.exports = {

  fetchGigSongs(gigSongs,uid){
    return new Promise((res,rej)=>{
      http.get(uid+'/songs/').then((songs)=>{
        const allSongs = firebaseListToArray(songs.val());
        console.log('allsongs ',allSongs, 'gigSongs: ',gigSongs)
        res(allSongs.filter((song)=>{
          if(song && gigSongs.find(val=>val.id===song.id)){
              song.set = gigSongs.find(val=>val.id===song.id).set;
              //console.log('FILTAH - ',song)
              return song;
          }
        }));
      });
    });
  }

}
