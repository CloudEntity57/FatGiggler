import React, { Component } from 'react';
import jQuery from 'jquery';

// import MakeSet from './MakeSet';

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

    // jQuery('.gig-preview').css('http://travel.home.sndimg.com/content/dam/images/travel/fullset/2015/08/03/top-florida-beaches/key-west-beach-florida.jpg.rend.hgtvcom.966.725.suffix/1491580836931.jpeg');
    let results = [];
    let navs = {};
    theSongs.forEach((val)=>{
      let target = '#'+val.id;
      // console.log('target: ',target);
      let pos = jQuery(target).position().top;
      results.push(pos);
    }
  );
  theSongs.forEach((val)=>{
    let target = '#'+val.id;
    // console.log('target: ',target);
    let pos = jQuery(target).position().top;
    navs[target]=pos;
  });
  // console.log('navs: ',navs);
    // console.log('array: ',results);
      this.setState({
        navIndexes:navs,
        scrollIndexes:results,
        target:target
      });
  }
  componentDidUpdate(){
    // console.log('the target in Songarea: ',this.props.target);
    // console.log('the navs in Songarea: ',this.state.navIndexes);
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
    // jQuery('.gig-preview').css('background-color','blue');
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
