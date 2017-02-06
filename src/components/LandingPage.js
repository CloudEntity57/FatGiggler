import React, { Component } from 'react';
import FBLoginBtn from './FBLoginBtn';

class LandingPage extends Component {
  
  render(){
    return(
      <div>
        <p>Hello from Landing Page</p>
        <FBLoginBtn />
      </div>
    );
  }
}

export default LandingPage;
