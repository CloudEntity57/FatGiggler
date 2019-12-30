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
};
