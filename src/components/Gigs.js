import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import { jquery } from 'jquery';
import SubmitModal from './SubmitModal';
import Song from './Song';
import Default from './DefaultGig';
import SongEditForm from './SongEditForm';
import GigView from './GigView';
import { renderGig } from './NewUserFilter';

class Gigs extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0,
      gigview:(<div></div>),
      gigedit:false,
      songmanage:false,
      songedit:false,
      submitted:false
    }
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
      this.postGig(this.state.gigs,gig_id);
    }
  }
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
      this.postGig(gigs);
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
        this.postGig(gigs,gigid);
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
    // console.log('you clicked: ',id);
    let gigs = this.state.gigs;
    this.postGig(gigs,id);
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
    firebase.database().ref('users/' + this.state.uid+'/').set({
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
      this.postGig(gigs,gigid);
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
      this.postGig(gigs,gigid);
    },200);
  }
  showSong(e){
    e.preventDefault();
    let songid= e.target.id;
    console.log('songs id is: ',songid);
    this.setState({
      song:songid,
      songedit:true
    });
    setTimeout(()=>{
      let gigid=this.state.gigshowing;
      let gigs=this.state.gigs;
      this.postGig(gigs,gigid);
    },200);
  }
  submit(title,lyrics,artist){
    let songid = this.state.songid;
    let uid = this.state.uid;
    firebase.database()
    .ref('/'+uid+'/songs/'+songid)
    .ref.update({
      title:title,
      lyrics:lyrics,
      artist:artist
    });
    this.setState({
      songedit:false
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
      this.postGig(gigs,gigid);
    },100);
  }
  postGig(gigs,id){
    console.log('posting');
    if(!gigs){
      gigs=Default.defaultgig;
      gigs = [{gig:gigs,id:1}];
      id=1;
      console.log('gigs id is: ',gigs[0].id);
        console.log('default gig 217 is: ',gigs);
    }
    gigs.forEach((val)=>{
      let gigid = val.id;
      console.log('title: ',val.gig.title);
      if(gigid===id){
        console.log('our gig to preview: ',val.id);
        let frame = [];
        let setnum = 1;
        let deleteButton = (this.state.songmanage) ? (<a href='#' id={gigid} onClick={this.deleteSong.bind(this)}><i className='fa fa-minus-circle' aria-hidden="true"></i></a>)
        :'';
        let editButton = (this.state.songmanage) ? (<a href='#' onClick={this.editSong.bind(this)}><i className='fa fa-pencil' aria-hidden="true"></i></a>)
        :'';

        let maxsets = parseInt(val.gig.setnum);
        console.log('maxsets: ',maxsets);
        let sets = val.gig.sets;
        console.log('sets: ', sets);
        //create an array of the latest songs from the database:
        let songs = [];
        let uid = this.state.uid;
        sets.forEach((obj)=>{
          let id = obj.id;
          firebase.database()
          .ref(uid+'/songs/'+id)
          .on('value',(data)=>{
            let result=data.val();
            result.id=id;
            songs.push(result);
          });
        });
        if(!this.state.gigs){
          songs=sets;
        }

        console.log('the songs are: ',songs);

        //=======================================================
        let renderSets = (tune,goods)=>{
          goods.push(<div className="gig-item-contain"><a href="#"><li onClick={this.showSong.bind(this)} id={tune.id}>{tune.title}</li></a><div className="gig-item">{deleteButton} {editButton}</div></div>)
        };
        renderGig(sets,setnum,songs,maxsets,frame,renderSets);


      let gigview2= (!this.state.songedit) ? (<GigView id={val.id} songs={songs} time={val.gig.time} title={val.gig.title} frame={frame} playGig={this.playGig.bind(this)} editSongs={this.manageSongs.bind(this)} done={this.done.bind(this)} />)
      :
      (<Song id={this.state.uid} cancel={this.cancelSong.bind(this)} song={this.state.song} />);

        this.setState({
          gigview:gigview2
        });
        return;
      }

    });
  }

  hideModal(){
    this.setState({
      submitted:false
    });
  }
  render(){

    let gigsInfo = '';
    let username = this.state.username;
    let apostrophe = (this.state.username) ? "'s " : '';
    let deleteButton = (this.state.gigedit) ? (<a href='#' onClick={this.deleteGigTarget.bind(this)}><i className='fa fa-minus-circle' aria-hidden="true"></i></a>)
    : '';
    let gigs;
    if(this.state.gigs){
      gigs = this.state.gigs;
      console.log('this state gigs is',gigs);
    }else{
      gigs = Default.defaultgig;
      gigs = [{gig:gigs}];
      console.log('this iteration of gigs is: ',gigs);
    }

      console.log('this state gigs');

      console.log('the gigs in Gigs.js: ',gigs);
        let frame=[];
        // console.log('our sets saved in state: ',this.state.sets);
        gigs.forEach((val)=>{
          let gig = val.gig;
                frame.push(
                  <div className="gig-item-contain"><a onMouseEnter={this.handleFocus.bind(this)} href="#" id={val.id}><li onClick= {this.displayGig.bind(this)} id={val.id}>{gig.title} </li></a><div data-subject={val.id} id={val.id+'animate'} className="gig-item">{deleteButton}</div></div>
                );
        });

      gigsInfo = (
        <div className="col-sm-6 gig-display">
        <button onClick={this.editGigs.bind(this)} className="btn-xs btn-primary">Manage</button>
        <h3>{username}{apostrophe}Gigs</h3>
        <ul>
          { frame }
        </ul>
      </div>
    );



    let gigmodal = (this.state.showing) ? (<div className="gig-preview gigmodal col-sm-6">
      <div className="gig-cover"></div>
      {this.state.gigview}
    </div>)
    : '';
    let please_login = (this.state.submitted) ? (<SubmitModal text={this.state.modaltext} hide={this.hideModal.bind(this)} />) : '';
    return(
      <div className="wrapper container landed_content">
        <div className="row">
          { gigmodal }
          { gigsInfo }
          <div className="gig-preview hidden-xs col-sm-6">
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
