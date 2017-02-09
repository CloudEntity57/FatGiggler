import React, { Component } from 'react';
import jQuery from 'jquery';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
// import MakeSet from './MakeSet';

class SongArea extends Component{

  constructor(props){
    super(props);
    this.state={
      song:"this.props.songs[1]",
      index:0,
      scrollIndexes:[],
      songs:[]
    }
  }
  componentWillMount(){
    let theSongs=this.props.songs;

    // console.log('songarea CWM songs: ',theSongs);
    this.setState({
      songs:theSongs
    });

  //       });
  //
  //     });
  //
  }
  //
  componentDidMount(){
    let theSongs=this.state.songs;
      let target=this.props.target;
    // console.log('current songs in CDM database: ',theSongs);
    let results = [];
    theSongs.forEach((val)=>{
      let target = '#'+val.id;
      // console.log('target: ',target);
      let pos = jQuery(target).position().top;
      results.push(pos);
    }
  );
    // console.log('array: ',results);
      this.setState({
        scrollIndexes:results,
        target:target
      });
      console.log('the songarea state target: ',this.state.target);
  }

  scroll(e){
        e.preventDefault();
        let foo = e.target.innerHTML;
        let songs = this.state.songs;
        if(foo==='-'){
          if(this.state.index===songs.length-1){return null}
          this.state.index++;
          jQuery('.song_scroll').stop().animate({
              'scrollTop': this.state.scrollIndexes[this.state.index]
          }, 900, 'swing');

        }else{
          if(this.state.index===0){return null}
          this.state.index--;
          jQuery('.song_scroll').stop().animate({
              'scrollTop': this.state.scrollIndexes[this.state.index]
          }, 900, 'swing');

          // window.location = jQuery(this).attr('href');
        };
    };


  render(){
    // console.log('songarea render song value: ',this.state.songs);
    // console.log('songarea render scrollIndexes value: ',this.state.scrollIndexes);

    let html = this.state.songs.map((val)=>{
      // console.log('the vals id: ',val.id);
      return(
      <div className="song">
        <h1 id={val.id}>{val.title}</h1>
        {val.lyrics}
      </div>)
    });
    
    return(
      <div className="col-sm-6 song_area">
        <div className="song_scroll">
        { html }
      </div>
      <section className="scroll_area">
        <div className="scroll_bar">
        <a href="#" ref="up" onClick={this.scroll.bind(this)}>+</a>
      </div>
        <div className="scroll_bar">
        <a href="#" ref="down" onClick={this.scroll.bind(this)}>-</a>
        </div>
      </section>
      </div>
    );
  }
}

export default SongArea;
