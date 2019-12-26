import React, { Component } from 'react';
import FBLoginBtn from './FBLoginBtn';
import GoogleLoginBtn from './GoogleLoginButton';
import { hashHistory } from 'react-router';
import moment from 'moment';
import { firebase } from '../utils/firebase';

class LandingPage extends Component {
  componentWillMount(){
    //log site visit
    var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      if(dd<10) {
          dd='0'+dd
      }

      if(mm<10) {
          mm='0'+mm
      }

      today = mm+'/'+dd+'/'+yyyy;
      console.log('date: ',today);
      firebase.database()
      .ref('/site_visits')
      .push({
        date:today
      });
  //========================
  }

  siteTour(e){
    e.preventDefault();

      hashHistory.push('/addgig');

  }
  render(){
    return(
      <div className="landing_page">
      <header className="landing_header clearfix">
        <div className="landing_background">
        </div>
        <div className="landing_overlay">
            <div className="landing_title">SmartSet</div>
            <div className="landing_header_txt">
              <div><a id="tour" href="#" onClick={this.siteTour.bind(this)}>Take A Tour</a></div>
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
            With SmartSet, take your gigs to the next level. Want to play a short gig with only upbeat funky tunes? A long gig with three slow blues sets? Just adjust your settings and generate the perfect new gig - endless possibilities are at your fingertips, so you can spend more time playing and less time planning.
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
