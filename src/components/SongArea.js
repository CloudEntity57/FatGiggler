import React, { Component } from 'react';
import jQuery from 'jquery';

class SongArea extends Component{

  constructor(props){
    super(props);
    this.state={
      song:"this.props.songs[1]",
      scrollIndexes:[],
      index:0,
      photo_index:1,
      navIndexes:[],
      songs:[]
    }
  }
  componentWillMount(){
    let theSongs=this.props.songs;
    this.setState({
      songs:theSongs
    });
  }
  componentDidMount(){
    const { songs } = this.state;
    let { target } = this.props;
    let results = [];
    let navs = {};
    songs.forEach((val)=>{
      let target = '#'+val.id;
      let pos = jQuery(target).position().top;
      results.push(pos);
    });
    songs.forEach((val)=>{
      let target = '#'+val.id;
      let pos = jQuery(target).position().top;
      navs[target]=pos;
    });
    this.setState({
      navIndexes:navs,
      scrollIndexes:results,
      target:target
    });
  }
  componentDidUpdate(){
    jQuery('.song_scroll').stop().animate({
        'scrollTop': this.state.navIndexes['#'+this.props.target]
    }, 900, 'swing');
  }

  changePic(){
    const photos=[
      'pexels-photo-196652.jpeg','girls.jpg','fun.jpg','beach.jpeg','arms.jpg'
    ];
    let indx = this.state.photo_index;
    console.log('was: ',indx);
    let pic = photos[indx];
    indx++;
    let url = 'url(./images/'+pic+')';
    jQuery('.gig-preview').css('background-image',url);
    console.log(url);
    indx = (indx<photos.length) ? indx++ : 0
    console.log('now: ',indx);
    this.setState({
      photo_index:indx
    });
  }

  scroll(e){
        e.preventDefault();
        // this.changePic();
        console.log(this.state.scrollIndexes);
        let foo = e.target.innerHTML;
        let songs = this.state.songs;
        console.log(this.state.songs);
        console.log(this.state.index);
        if(foo==='-'){
          if(this.state.index===songs.length-1){
            return null;
          }
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
        };
    };


  render(){
    let html = this.state.songs.map((val)=>{
      return(
      <div className="song">
        <div className="song-top">
        <h3 id={val.id}>{val.title}</h3> - <h4>{val.artist}</h4>
        </div>
        <p>
        {val.lyrics}
        </p>
      </div>)
    });

    return(
      <div className="col-sm-6 gig-preview song_area">
        <button onClick={this.changePic.bind(this)} className="view_shift btn btn-default" type="button">Change View</button>
        <div className="gig-cover"></div>
        <div className="song_scroll">
        { html }
      </div>
      <section className="scroll_area hidden-xs">
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
