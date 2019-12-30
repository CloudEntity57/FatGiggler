import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import { jquery } from 'jquery';
import SubmitModal from './SubmitModal';
import Song from './Song';
import Default from './DefaultGig';
import jQuery from 'jquery';
import SongEditForm from './SongEditForm';
import GigView from './GigView';
import GigList from './gig-components/GigList';
import HttpService from '../services/http';
import { fetchGigSongs } from '../services/gigsService';

class Gigs extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0,
      gigview:(<div></div>),
      gigedit:false,
      songmanage:false,
      songedit:false,
      submitted:false,
      photo_index:1
    }
    this.http = new HttpService();
  }

  componentDidMount(){
    const user = firebase.auth().currentUser;
    console.log('current user: ',user);
    const uid = (user) ? user.uid : '';
    const username = (user) ? user.displayName : '';
    // const username =
    this.setState({
      uid:uid,
      username:username
    });
    let gig_id;
    if(this.state.uid==''){
      gig_id = (this.state.gigs) ? this.state.gigs[0].gig.id : '';
    }

    console.log('cdm id: ',gig_id);
    if(user !==null){
      this.gigReset(uid);
    }else{
      this.initGigs(this.state.gigs,gig_id);
    }
  }

  initGigs(gigs,id){
    console.log('posting');
    //Display default gig if no gigs saved:
    if(!gigs){
      gigs=Default.defaultgig;
      gigs = [{gig:gigs,id:1}];
      id=1;
      console.log('gigs id is: ',gigs[0].id);
        console.log('default gig 217 is: ',gigs);
    }

    gigs.forEach((gig)=>{
      let { songmanage, songedit } = this.state;
      let gigid = gig.id;
      console.log('title: ',gig.gig.title);
      if(gigid===id){
        console.log('our gig to preview: ',gig);
        // let frame = [];
        let deleteButton = (<a href='#' id={gigid} onClick={this.deleteSong.bind(this)}><i className='fa fa-minus-circle' aria-hidden="true"></i></a>);
        let editButton = (<a href='#' onClick={this.editSong.bind(this)}><i className='fa fa-pencil' aria-hidden="true"></i></a>);

        let maxsets = parseInt(gig.gig.setnum);
        console.log('maxsets: ',maxsets);
        let gigSongs = gig.gig.sets;
        console.log('gigSongs: ', gigSongs);
        //create an array of the latest songs from the database:
        let uid = this.state.uid;

        fetchGigSongs(gigSongs,uid).then((gigSongArray)=>{
          console.log('the songs ARE: ',gigSongArray);
          let gigListData = {
            gigSongs,
            gigSongArray,
            maxsets,
            // callback,
            editButton,
            deleteButton,
            songmanage,
            showSong:this.showSong.bind(this),
            type:'gigs'
          }
          let frame = [];
          const gigViewData = {
            id:gig.id,
            songs:gigSongArray,
            time:gig.gig.time,
            title:gig.gig.title,
            frame:(<div><GigList {...gigListData}/></div>),
            playGig:this.playGig.bind(this),
            editSongs:this.manageSongs.bind(this),
            done:this.done.bind(this)
          }
          let gigview2= (!songedit) ? (
            <GigView {...gigViewData}/>
          )
          :
          (<Song id={this.state.uid} cancel={this.cancelSong.bind(this)} song={this.state.song} />);

          this.setState({
            gigview:gigview2
          });
        });

        if(!this.state.gigs){
          gigSongs=gigSongs;
        }
      }
    });
  }

  // fetchGigSongs(gigSongs,uid){
  //   return new Promise((res,rej)=>{
  //     let gigSongArray = [];
  //     this.http.get(uid+'/songs/').then((songs)=>{
  //       const allSongs = firebaseListToArray(songs.val());
  //       console.log('allsongs ',allSongs, 'gigSongs: ',gigSongs)
  //       res(allSongs.filter((song)=>{
  //         if(song && gigSongs.find(val=>val.id===song.id)){
  //             song.set = gigSongs.find(val=>val.id===song.id).set;
  //             console.log('FILTAH - ',song)
  //             return song;
  //         }
  //       }));
  //     });
  //   });
  // }
  gigReset(uid){
    firebase.database()
    .ref('/'+uid+'/gigs')
    .on('value',(data)=>{
      let snapshot = data.val();
      let gigs = firebaseListToArray(snapshot);
      // console.log('the Gig.js gigs we are working with are: ',gigs);
      this.setState({
        gigs:gigs
      });
      console.log('gigreset: ',gigs[0].gig);
      this.initGigs(gigs);
      return gigs;
  });
}
  deleteSong(e){
    e.preventDefault();
    if(this.state.uid ===''){
      this.setState({
        submitted:true,
        modaltext:'You gotta log in first.'
      });
      return;
    }
    let gigs = this.state.gigs;
    let uid=this.state.uid;
    let songid = e.target.parentNode.parentNode.previousSibling.getAttribute('id');
    let gigid = e.target.parentNode.getAttribute('id');
    console.log('song id: ',songid);
    console.log('gig id: ',gigid);
    firebase.database()
    .ref('/'+uid+'/gigs/'+gigid+'/gig/sets/')
    .orderByChild('id')
    .equalTo(songid)
    .on('child_added',(data)=>{
      console.log('the target to delete: ',data);
      let reset = ()=>{
        let gigs=this.state.gigs;
        this.gigReset(uid);
        this.initGigs(gigs,gigid);
      }
        if(confirm('Are you sure?')){
          data.ref.remove();
          hashHistory.push('/gigs');
          setTimeout(reset,500);
        }
    });
  }

  done(e){
    e.preventDefault();
    this.setState({
      showing:false
    });
  }

  displayGig(e,id){
    e.preventDefault();
    id = e.target.id || id;
    console.log('you clicked: ',id);
    let gigs = this.state.gigs;
    this.initGigs(gigs,id);
    this.setState({
      gigshowing:id,
      showing:true
    });
  }
  playGig(e){
    e.preventDefault();
    let gigid = e.target.id;
    if(this.state.uid==''){
      hashHistory.push('dashboard');
    }
    // console.log('you clicked the gig: ',gigid);
    // firebase.database().ref('users/' + this.state.uid+'/').set({
    this.http.post('users/' + this.state.uid+'/',{
      playing:gigid
    }).then((data)=>{
      console.log('success!');
      hashHistory.push('/dashboard');
    });
  }

  editGigs(e){
  e.preventDefault();
    if(!this.state.gigedit){
      this.setState({
        gigedit:true
      });
    }else{
      this.setState({
        gigedit:false
      });
    }
  }
  manageSongs(){
    if(!this.state.songmanage){
      this.setState({
        songmanage:true
      });
    }else{
      this.setState({
        songmanage:false
      });
    }
    setTimeout(()=>{
      let gigid=this.state.gigshowing;
      let gigs=this.state.gigs;
      this.initGigs(gigs,gigid);
    },100);
  }
  editSong(e){
    e.preventDefault();
    if(this.state.uid ===''){
      this.setState({
        submitted:true,
        modaltext:'You gotta log in first.'
      });
      return;
    }
    let songid= e.target.parentNode.parentNode.parentNode.firstChild.id;
    console.log('songs id is: ',songid);
    this.setState({
      song:songid,
      songedit:true
    });
    setTimeout(()=>{
      let gigid=this.state.gigshowing;
      let gigs=this.state.gigs;
      this.initGigs(gigs,gigid);
    },200);
  }
  showSong(song){
    let songid= song.id;
    console.log('songs id is: ',songid);
    this.setState({
      song:songid,
      songedit:true
    });
    setTimeout(()=>{
      let gigid=this.state.gigshowing;
      let gigs=this.state.gigs;
      this.initGigs(gigs,gigid);
    },200);
  }
  submit(title,lyrics,artist){
    let songid = this.state.songid;
    let uid = this.state.uid;
    // firebase.database()
    // .ref('/'+uid+'/songs/'+songid)
    // .ref.update({
    //   title:title,
    //   lyrics:lyrics,
    //   artist:artist
    // });
    // this.setState({
    //   songedit:false
    // });
    this.http.put('/'+uid+'/songs/'+songid,{
       title:title,
       lyrics:lyrics,
       artist:artist
    }).then((res)=>{
     this.setState({
       songedit:false
     });
    });
  }
  deleteGigTarget(e){
    e.preventDefault();
    let item = e.target.parentNode.parentNode.getAttribute('data-subject');
    this.deleteGig(e,item);
  }
  deleteGig(e,obj){

    e.preventDefault();
    let uid=this.state.uid;
    let id= obj || e.target.id;
    let target = firebase.database()
    .ref('/'+uid+'/gigs/'+id);
    console.log('target to delete: ',target);
    if(confirm('Are you sure?')){
      target.remove();
    }

  }
  handleFocus(e){
    e.preventDefault;
    // let id=e.target.id;
    // console.log(id);
    // console.log('hover');
    // jquery('#'+id+'animate').animate({width:'toggle'},350);
  }
  cancelSong(e){
    this.setState({
      songedit:false
    });
    setTimeout(()=>{
      let gigid=this.state.gigshowing;
      let gigs=this.state.gigs;
      this.initGigs(gigs,gigid);
    },100);
  }

  hideModal(){
    this.setState({
      submitted:false
    });
  }
  changePic(){
    const photos=[
      'pexels-photo-196652.jpeg','girls.jpg','fun.jpg','beach.jpeg','arms.jpg'
    ];
    let indx = this.state.photo_index;
    console.log('was: ',indx);
    let pic = photos[indx];
    indx++;
    let url = 'url(./images/'+pic+')';
    // jQuery('.gig-preview').css('background-color','blue');
    jQuery('.gig-preview').css('background-image',url);
    console.log(url);
    indx = (indx<photos.length) ? indx++ : 0
    console.log('now: ',indx);
    this.setState({
      photo_index:indx
    });
  }
  render(){
    let { gigedit, username, gigs, gigview, showing } = this.state;
    let apostrophe = (username) ? "'s " : '';
    if(!gigs){
      gigs = [{gig:Default.defaultgig}];
    }

    console.log('the gigs in Gigs.js: ',gigs);

    //render gig songs:

    let gigsInfo = (
      <div className="col-sm-6 gig-display">
      <div className="gig-buttons">
        <button onClick={this.editGigs.bind(this)} className={"btn"+(gigedit ? " btn-warning" : "  btn-primary")}>{gigedit ? 'Cancel' : 'Manage'}</button>
      </div>
        <h3>{username}{apostrophe}Gigs</h3>
        <ul>
          {
            gigs.map((val)=>{
            let gig = val.gig;
              return(
                <div className="gig-item-contain">
                  <a onMouseEnter={this.handleFocus.bind(this)} href="#" id={val.id}>
                    <li onClick= {this.displayGig.bind(this)} id={val.id}>{gig.title} </li>
                  </a>
                  {gigedit && (
                    <div data-subject={val.id} id={val.id+'animate'} className="gig-item">
                      <a href='#' onClick={this.deleteGigTarget.bind(this)}><i className='fa fa-minus-circle' aria-hidden="true"></i></a>
                    </div>
                  )}
                </div>
              );
            })
          }
        </ul>
      </div>
    );



    let gigmodal = (showing) ? (
      <div className="gig-preview gigmodal col-sm-6">
        <div className="gig-cover"></div>
        {gigview}
      </div>)

    : '';
    let please_login = (this.state.submitted) ? (<SubmitModal text={this.state.modaltext} hide={this.hideModal.bind(this)} />) : '';
    return(
      <div className="wrapper container landed_content">
        <div className="row">
          { gigmodal }
          { gigsInfo }
          <div className="gig-preview hidden-xs col-sm-6">
            <button onClick={this.changePic.bind(this)} className="view_shift btn btn-default" type="button">Change View</button>
            <div className="gig-cover"></div>
            {this.state.gigview}
          </div>
        </div>
        { please_login }
      </div>
    );

  }
}

export default Gigs;
