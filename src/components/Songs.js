import React, { Component } from 'react';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';

class Songs extends Component{
  render(){
    return(
        <div className="wrapper container">

          <div className="row">
            <div className="gig-view col-sm-6">
            </div>
          </div>
        </div>

    );
  }
}

export default Songs;
