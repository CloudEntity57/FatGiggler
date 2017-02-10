import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';

class Gigs extends Component{
  constructor(props){
    super(props);
    this.state={
      uid:0,
      gigview:(<h3>Select a gig and see it here</h3>)
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
  deleteGig(e){
    let uid=this.state.uid;
    e.preventDefault();
    let id=e.target.id;
    let target = firebase.database()
    .ref('/'+uid+'/gigs/'+id);
    console.log('target to delete: ',target);
    if(confirm('Are you sure?')){
      target.remove();
    }

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

        val.gig.sets.map((set)=>{
          let goods = [];
          set.map((val)=>{
            // console.log('the setss song is: ',val);
            goods.push(<li id={val.id}>{val.title}</li>);
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
          <h1>{val.gig.title}</h1>
          <ul>
            { frame }
          </ul>
          <div className="gig-buttons">
          <button onClick={this.deleteGig.bind(this)} id={val.id} className="btn btn-primary">Delete</button>
          <button onClick={this.playGig.bind(this)} id={val.id} className="btn btn-primary">Play</button>
          </div>
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
  render(){
    let gigsInfo = '';
    let username = this.state.username;
    if(this.state.gigs){
      let gigs = this.state.gigs;
      // console.log('the gigs in Gigs.js: ',gigs);
        let frame=[];
        // console.log('our sets saved in state: ',this.state.sets);
        gigs.forEach((val)=>{
          let gig = val.gig;
                frame.push(<a href="#" ><li onClick={this.displayGig.bind(this)} id={val.id}>{gig.title} </li></a>);
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
