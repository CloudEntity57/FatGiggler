import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import { jquery } from 'jquery';

class Gigs extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0,
      gigview:(<h3>Select a gig and see it here</h3>),
      gigedit:false,
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
    });;
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
  editSongs(e){
    e.preventDefault();
    if(!this.state.songedit){
      this.setState({
        songedit:true
      });
    }else{
      this.setState({
        songedit:false
      });
    }
    let gigview=this.state.gigview;
    this.setState({
      gigview:gigview
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
    let id=e.target.id;
    console.log(id);
    console.log('hover');
    jquery('#'+id+'animate').animate({width:'toggle'},350);
  }
  postGig(gig,id){
    gig.forEach((val)=>{
      let gigid = val.id;
      if(gigid===id){
        // console.log('our gig to preview: ',val.gig);
        let frame = [];
        let setnum = 1;
        let deleteButton = (this.state.songedit) ? (<a href='#' id={gigid} onClick={this.deleteSong.bind(this)}><i className='fa fa-minus-circle' aria-hidden="true"></i></a>)
        :'';
        let editButton = (<a href='#' onClick={this.deleteGig.bind(this)}><i className='fa fa-pencil' aria-hidden="true"></i></a>);

        let maxsets = parseInt(val.gig.setnum);
        console.log('maxsets: ',maxsets);
        let sets = val.gig.sets;

        //=======================================================
        for(let x=0; x<maxsets; x++){
          let  goods=[];
          // go through every song in the gig:
          for (var song =0; song<sets.length; song++) {
            // console.log('the song to iterate through: ',sets[song]);
            if (sets.hasOwnProperty(song)) {
            // check if song has current gig number
              if(sets[song].set===setnum){
                console.log('yes its running');
                //create the ESX for that set
                // goods.push(<li>{sets[song].title}</li>);
                goods.push(<div className="gig-item-contain"><li id={sets[song].id}>{sets[song].title}</li><div className="gig-item">{deleteButton}</div></div>);

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


        let gigview = (
          <div>
          <div className="gig-buttons">
          <button onClick={this.playGig.bind(this)} id={val.id} className="btn btn-primary">Play</button>
          <button onClick={this.editSongs.bind(this)} id={val.id} className="btn btn-primary">Manage</button>
          <button onClick={this.done.bind(this)} className="btn btn-primary hidden-sm hidden-md hidden-lg">Done</button>
          </div>
          <h1>{val.gig.title}</h1>
          <ul>
            { frame }
          </ul>
        </div>
      );
        this.setState({
          gigview:gigview
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
      console.log('the gigs in Gigs.js: ',gigs);
        let frame=[];
        // console.log('our sets saved in state: ',this.state.sets);
        gigs.forEach((val)=>{
          let gig = val.gig;
                frame.push(
                  <div className="gig-item-contain"><a onMouseEnter={this.handleFocus.bind(this)} href="#" id={val.id}><li onClick= {this.displayGig.bind(this)} id={val.id}>{gig.title} </li></a><div data-subject={val.id} id={val.id+'animate'} className="gig-item">{deleteButton}</div></div>
                );
        });
        //can't be ternary here - large views require gig list in both states (fix)
      //   gigsInfo = (!this.state.showing) ? (
      //     <div className="col-sm-6 gig-display">
      //     <h3>{username}'s Gigs</h3>
      //     <ul>
      //       { frame }
      //     </ul>
      //   </div>
      // )
      // : '';
      gigsInfo = (
        <div className="col-sm-6 gig-display">
        <button onClick={this.editGigs.bind(this)} className="btn-xs btn-default">Manage</button>
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
