import React, { Component } from 'react';
import FBLoginBtn from './FBLoginBtn';
import { hashHistory } from 'react-router';

class LandingPage extends Component {

  render(){
    return(
      <div>
      <header className="landing_header clearfix">
        <div className="landing_background">

        </div>
        <div className="landing_overlay">
            <div className="landing_title">Fat Giggler</div>
            <div className="landing_header_txt">
              Get your gig on.
              <div className="login-btn">
                <p>
                  Take control of your gigs with our smart system. Organize by choosing your mood, genre and desired number of sets.
                </p>
              <FBLoginBtn />
              </div>
            </div>
            {/* <ul className="main_nav">

              <li><a href="#">Log Out</a></li>
              <li><a href="#">Chat</a></li>
              <li><a href="#">Songs</a></li>
              <li><a href="#">Sets</a></li>

            </ul>  */}
        </div>
      </header>
      <div className="container landing_content">
        <div className="row">

        </div>
      </div>
    </div>
    );
  }
}

export default LandingPage;
