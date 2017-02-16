import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';

class Gigs extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0,
      gigview:(<h3>Select a gig and see it here</h3>),
      gigedit:false
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
    firebase.database()
    .ref('/'+uid+'/gigs')
    .on('value',(data)=>{
      let snapshot = data.val();
      let gigs = firebaseListToArray(snapshot);
      // console.log('the Gig.js gigs we are working with are: ',gigs);
      this.setState({
        gigs:gigs
      });
    });

  }
  deleteSong(e){
    e.preventDefault();
    let uid=this.state.uid;
    let songid = e.target.parentNode.parentNode.previousSibling.getAttribute('id');
    let gigid = e.target.parentNode.getAttribute('id');
    console.log('song id: ',songid);
    console.log('gig id: ',gigid);
    let target = '';
    firebase.database()
    .ref('/'+uid+'/gigs/'+gigid+'/gig/sets')
    .on('value',(data)=>{
      target = data;
    });
    let obj = firebaseListToArray(target).length;
    console.log('target to delete: ',obj);
    // if(confirm('Are you sure?')){
    //   target.remove();
    // }

  }

  displayGig(e){
    e.preventDefault();
    let id = e.target.id;
    // console.log('you clicked: ',id);
    let gig = this.state.gigs;

    gig.forEach((val)=>{
      let gigid = val.id;
      if(gigid===id){
        let frame = [];
        let setnum = 1;
        let deleteButton = (<a href='#' id={gigid} onClick={this.deleteSong.bind(this)}><i className='fa fa-minus-circle' aria-hidden="true"></i></a>);
        let editButton = (<a href='#' onClick={this.deleteGig.bind(this)}><i className='fa fa-pencil' aria-hidden="true"></i></a>);

        val.gig.sets.map((set)=>{
          let goods = [];
          set.map((val)=>{
            // console.log('the setss song is: ',val);
            goods.push(<div className="gig-item-contain"><li id={val.id}>{val.title}</li><div className="gig-item">{deleteButton}{editButton}</div></div>);

          });
          // console.log('heres a set! ',set);
          frame.push(
            <div className="set">
            <h3>Set {setnum}</h3>
            <ul>
              {goods}
            </ul>
          </div>
          );
          setnum++;
        });
        let gigview = (
          <div>
          <div className="gig-buttons">
          <button onClick={this.playGig.bind(this)} id={val.id} className="btn btn-primary">Play</button>
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
  playGig(e){
    e.preventDefault();
    let gigid = e.target.id;
    // console.log('you clicked the gig: ',gigid);
    firebase.database().ref('users/' + this.state.uid).set({
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
  render(){
    let gigsInfo = '';
    let username = this.state.username;
    let deleteButton = (<a href='#' onClick={this.deleteGigTarget.bind(this)}><i className='fa fa-minus-circle' aria-hidden="true"></i></a>);
    if(this.state.gigs){
      let gigs = this.state.gigs;
      // console.log('the gigs in Gigs.js: ',gigs);
        let frame=[];
        // console.log('our sets saved in state: ',this.state.sets);
        gigs.forEach((val)=>{
          let gig = val.gig;
                frame.push(<div className="gig-item-contain"><a href="#" id={val.id}><li onClick= {this.displayGig.bind(this)} id={val.id}>{gig.title} </li></a><div data-subject={val.id} className="gig-item">{deleteButton}</div></div>);
        });

        gigsInfo = (
          <div className="col-sm-6 gig-display">
          <h3>{username}'s Gigs</h3>
          <ul>
            { frame }
          </ul>
        </div>
      );


    }

    return(
      <div className="wrapper container landed_content">

        <div className="row">
          { gigsInfo }
          <div className="gig-preview col-sm-6">
            <div className="gig-cover"></div>
            {this.state.gigview}
          </div>
        </div>
      </div>
    );

  }
}

export default Gigs;
