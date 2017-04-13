import DefaultSongs from './DefaultSongs';
import React from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';

module.exports = {
  checkUserStatus:(newuser,uid,user)=>{
    firebase.database()
    .ref('/users/loggedin')
    .on('value',(val)=>{
      val = val.val();
      val = firebaseListToArray(val);
      console.log('vals to filter for new users: ',val);
      this.filterNewUser(val,newuser,uid,name,user);
    });
  },
  filterNewUser:(val,newuser,uid,name,user)=>{
    val.forEach((i)=>{
      // i=firebaseListToArray(i);
      console.log('i.id: ',i.id);
      if(i.id===uid){
        newuser=false;
        console.log('user exists');
        firebase.database()
        .ref('/users/loggedin/'+uid)
        .set({
          name:user.displayName,
          photo:user.photoURL,
          online:'true'
        });
      }
    });
    if(newuser===true){
      this.setUpNewUser(uid,name,user);
    };
  },
  setUpNewUser:(uid,name,user)=>{

      let defaultsongs = DefaultSongs.songs;
      firebase.database()
      .ref('/users/loggedin/'+uid)
      .set({
        name:user.displayName,
        photo:user.photoURL,
        online:'true'
      });
        firebase.database()
        .ref('/'+uid)
        .set({
          songs:defaultsongs
        });
      console.log('welcome new user!');
      this.setState({
        newuser:true,
        playing:''
      });
    },
    renderGig(sets,setnum,songs,maxsets,frame,callback){
      for(let x=0; x<maxsets; x++){
        let  goods=[];
        // go through every song in the gig:
        for (var int =0; int<sets.length; int++) {
          // console.log('the song to iterate through: ',sets[song]);
          if (sets.hasOwnProperty(int)) {
          // check if song has current gig number
          let tune = [];
            if(sets[int].set===setnum){
              //grab the matching song from our updated array 'songs'
              for(let i=0; i<songs.length; i++){
                if(songs[i].id===sets[int].id){
                  tune = songs[i];
                  // console.log('the tune is: ',tune);
                  break;
                }
              }
              if(tune=='')break;
               callback(tune,goods);
            }
          }
        }
        frame.push(
          <div className="set">
          <h3>Set {setnum}</h3>
          <ul>
            {goods}
          </ul>
        </div>
        );
        //increase the set number
        setnum++;
      }
    }
};
