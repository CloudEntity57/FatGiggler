import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import { jquery } from 'jquery';
import Song from './Song';
import SongEditForm from './SongEditForm';
import GigView from './GigView';

class Gigs extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0,
      gigview:(<h3>Select a gig and see it here</h3>),
      gigedit:false,
      songmanage:false,
      songedit:false
    }
  }

  componentDidMount(){
    const user = firebase.auth().currentUser;
    console.log('current user: ',user);
    const uid = user.uid;
    const username = user.displayName;
    // const username =
    this.setState({
      uid:uid,
      username:username
    });
    this.gigReset(uid);

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
      return gigs;
  });
}
  deleteSong(e){
    e.preventDefault();
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

  displayGig(e){
    e.preventDefault();
    let id = e.target.id;
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
    gigs.forEach((val)=>{
      let gigid = val.id;
      if(gigid===id){
        console.log('our gig to preview: ',val.gig);
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
        console.log('the songs are: ',songs);

        //=======================================================
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
                    console.log('the tune is: ',tune);
                  }
                }
          //create the ESX for that set
                goods.push(<div className="gig-item-contain"><li onClick={this.showSong.bind(this)} id={tune.id}>{tune.title}</li><div className="gig-item">{deleteButton} {editButton}</div></div>);

              }
            }
          }
          frame.push(
            <div>
            <h3>Set {setnum}</h3>
            <ul>
              {goods}
            </ul>
          </div>
          );
          //increase the set number
          setnum++;
        }

      let gigview2= (!this.state.songedit) ? (<GigView id={val.id} songs={songs} time={val.gig.time} title={val.gig.title} frame={frame} playGig={this.playGig.bind(this)} editSongs={this.manageSongs.bind(this)} done={this.done.bind(this)} />)
      :
      (<Song id={this.state.uid} cancel={this.cancelSong.bind(this)} song={this.state.song} />);

        this.setState({
          gigview:gigview2
        });
      }

    });
  }
  render(){

    let gigsInfo = '';
    let username = this.state.username;
    let deleteButton = (this.state.gigedit) ? (<a href='#' onClick={this.deleteGigTarget.bind(this)}><i className='fa fa-minus-circle' aria-hidden="true"></i></a>)
    : '';
    if(this.state.gigs){
      let gigs = this.state.gigs;
      // console.log('the gigs in Gigs.js: ',gigs);
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
        <h3>{username}'s Gigs</h3>
        <ul>
          { frame }
        </ul>
      </div>
    );


    }
    let gigmodal = (this.state.showing) ? (<div className="gig-preview gigmodal col-sm-6">
      <div className="gig-cover"></div>
      {this.state.gigview}
    </div>)
    : '';

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
      </div>
    );

  }
}

export default Gigs;
