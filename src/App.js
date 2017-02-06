import React, { Component } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import { firebase, firebaseListToArray } from './utils/firebase';
import { hashHistory } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        hashHistory.push('/dashboard');
      } else {
        this.setState({ user: {} });
      }
    });
  }

  render() {
    return (
      <div>
        <Header user={this.state.user}/>
        { this.props.children || <LandingPage />}
        <Footer />
      </div>
    );
  }
}

export default App;
