import React, { Component } from 'react';
import FBLoginBtn from './FBLoginBtn';
import GoogleLoginBtn from './GoogleLoginButton';
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
              <GoogleLoginBtn />
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
      <div className="landing_content">
      <div className="container">
        <div className="row">
          <div className="col-xs-1"></div>
          <div className="col-xs-10 landing_text">
            With Fat Giggler, take your gigs to the next level. Want to play a short gig with only upbeat funky tunes? A long gig with three slow blues sets? Just adjust your settings and generate the perfect new gig - endless possibilities are at your fingertips, so you can spend more time playing and less time planning.
          </div>
          <FBLoginBtn />
          <div className="col-xs-1"></div>
        </div>
      </div>
    </div>
    </div>
    );
  }
}

export default LandingPage;
