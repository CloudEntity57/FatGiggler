import React, { Component } from 'react';
import SongArea from './SongArea';
import SetList from './SetList';
import { firebase, firebaseListToArray } from '../utils/firebase';
import { hashHistory } from 'react-router';
import moment from 'moment';
import jquery from 'jquery';
import dotenv from 'dotenv';
import makesets from '../utils/makesets';
dotenv.config({silent:true});


class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state={
      defaultset:"My favorite Set's ID",
      uid:0,
      showdefault:true,
      genres:['rock','pop','Singer/Songwriter']
    }
  }

  componentWillMount(){


          //----====================MUSIXMATCH API CONNECTION TEST======================================//

            // let musix = process.env.REACT_APP_MUSIX_APP_API;
            // console.log('my api key is: ',musix);
            //
            // // let artists = [
            // //   "bob dylan",
            // //   "jeff buckley",
            // //   "ed sheeran",
            // //   "bruno mars",
            // //   "leonard cohen",
            // //   "B.B. King",
            // //   "grateful dead",
            // //   "beatles",
            // //   "elvis presley",
            // //   "ray charles",
            // //   "stevie wonder",
            // //   "steely dan",
            // //   "david bowie",
            // //   "prince",
            // //   "frank sinatra",
            // //   "aretha franklin",
            // //   "tori amos"
            // // ];
            // let artists = [
            //   "bob dylan"
            //  ];
            // let artists_htmlstring= artists.map((val)=>{
            //   var mod = val.replace(/ /g,'%20');
            //   return mod;
            // });
            //
            // let artists_query_array = artists_htmlstring.map((val)=>{
            //   let api_top10_search_str = "http://api.musixmatch.com/ws/1.1/track.search?apikey="+musix+"&q_artist="+val+"&page_size=10&page=1&s_track_rating=desc";
            //   // console.log('search string: ',api_top10_search_str);
            //   return api_top10_search_str;
            // });
            // // console.log('modified array: ',artists_query_array);
            // let result_array = [];
            // let defaultsongs = [];
            // for(let i=0; i<artists_query_array.length; i++){
            //   jquery.get(artists_query_array[i],(val)=>{
            //     var output = JSON.parse(val);
            //     console.log('we are getting for output: ',output.message.body.track_list);
            //     result_array.push(output.message.body.track_list);
            //         if(result_array.length === artists.length){
            //           console.log('result arrays length: ',result_array.length);
            //           console.log('result array: ',result_array);
            //           for(let i=0; i<result_array.length; i++){
            //             console.log('result_array item: ',result_array[i]);
            //           // go through every song in the list
            //             for(let n=0; n<result_array[i].length; n++){
            //           // for each song save the title, artist, length, lyrics and genres inside an object identical to song database
            //               let mysong = result_array[i][n];
            //               console.log('my song: ',mysong);
            //               let songObject = {};
            //               songObject.title = mysong.track.track_name;
            //               songObject.artist = mysong.track.artist_name;
            //               songObject.trackid = mysong.track.track_id;
            //               defaultsongs.push(songObject);
            //           // push that object to the default song array and set the default state to that array
            //             }
            //           //pass those songs to the two dashboard components for display
            //           }
            //           console.log('default songs: ',defaultsongs);
            //           this.setState({
            //             defaultsongs:defaultsongs
            //           });
            //         }
            //   });
            // }
            //
            //


            //create default gig for user from the site's default artist database

            // let defaultgig={
            //   title:'My Gig',
            //   genres:this.state.genres,
            //   sets:setfiltered,
            //   maxminutes:216000000
            // };


          //===================================//
  //
    let defaultgig = {
    setnum : "3",
    genres : [ "blues", "alternative", "jazz", "sublime", "soul" ],
    maxminutes : 216000000,
    sets : [{
      artist : "Stevie Wonder",
      id : "-Kc_uIa1dU8ZUQReR3s6",
      lyrics : "Like a fool I went and stayed too long\nNow I'm wondering if your love's still strong\nOo, baby, here I am, signed, sealed, delivered, I'm yours!\n\nThen that time I went and said goodbye\nNow I'm back and not ashamed to cry\nOo, baby, here I am, signed, sealed, delivered, I'm yours!\n\nHere I am baby\nSigned, Sealed, Delivered, I'm yours\n(You got my future in your hands)\nHere I am baby\nSigned, Sealed, Delivered, I'm yours\n(You got my future in your hands)\n\nI've done a lot of foolish things\nThat I really didn't mean, didn't I?\n\nSeen a lot of things in this old world\nWhen I touch them, they mean nothing, girl\nOo, baby, here I am, signed, sealed, delivered, I'm yours!\n\nOowee baby, you set my soul on fire\nThat's why I know you're my heart's only desire\n\nHere I am baby\nSigned, Sealed, Delivered, I'm yours\n(You got my future in your hands)\nHere I am baby\nSigned, Sealed, Delivered, I'm yours\n(You got my future in your hands)\n\nLike a fool I went and stayed too long\nNow I'm wondering if your love's still strong\nOo, baby, here I am, signed, sealed, delivered, I'm yours!\n\nThen that time I went and said goodbye\nNow I'm back and not ashamed to cry\nOo, baby, here I am, signed, sealed, delivered, I'm yours!\n\nHere I am baby\nSigned, Sealed, Delivered, I'm yours\n(You got my future in your hands)\nHere I am baby\nSigned, Sealed, Delivered, I'm yours\n(You got my future in your hands)\n\nI've done a lot of foolish things\nThat I really didn't mean, didn't I?\n\nSeen a lot of things in this old world\nWhen I touch them, they mean nothing, girl\nOo, baby, here I am, signed, sealed, delivered, I'm yours!\n\nOowee baby, you set my soul on fire\nThat's why I know you're my heart's only desire\n\nHere I am baby\nSigned, Sealed, Delivered, I'm yours\n(You got my future in your hands)\nHere I am baby\nSigned, Sealed, Delivered, I'm yours\n(You got my future in your hands)\n\n\n\n",
      moods : [ "upbeat", "jazz", "soul" ],
      time : "4:15",
      title : "Signed, Sealed Delivered",
      set: 1
    }, {
      artist : "Led Zeppelin",
      id : "-KcalmzRwewciGz8I4ax",
      lyrics : "Been Dazed and Confused for so long it's not true.\nWanted a woman, never bargained for you.\nLots of people talk and few of them know, \nsoul of a woman was created below. \n\nYou hurt and abuse tellin' all of your lies. \nRun around sweet baby, Lord how they hypnotize. \nSweet little baby, I don't know where you've been. \nGonna love you baby, here I come again. \n\nEvery day I work so hard, bringin' home my hard earned pay \nTry to love you baby, but you push me away. \nDon't know where you're goin', only know just where you've been, \nSweet little baby, I want you again. \n\nBeen dazed and confused for so long, it's not true. \nWanted a woman, never bargained for you. \nTake it easy baby, let them say what they will. \nWill your tongue wag so much when I send you the bill\n\n\n",
      moods : [ "blues", "slow" ],
      time : "5:15",
      title : "Dazed and Confused",
      set: 1
    }, {
      artist : "Amos Lee",
      id : "-Kcao4eejoTP4P9R4D_D",
      lyrics : "Been some time\nSince the first night I saw you\nHad some good\nHad some bad time since then\nAnd through all of these moments that I've gotten to know you\nI realized that I want to be a little bit more than your friend\n\nAnd I wanna know\nIf you want to get together\nStay for a while\nWe can talk about it all\nI wanna know\nCuz this feeling won't let me go\n\nStood around\nWhile you dated that old fool Marcus\nWhole time knew he wasn't no damn good for you, well.\nGuess it's true sometimes we can all be a little heartless\nBut tonight, all I wanna do is make sweet love to you.\n\nAnd I wanna know\nIf you want to get together\nStay for a while\nWe can talk about it all\nI wanna know\nCuz this feeling won't let me go\n\nWell, all those wasted nights you spend\nWell, just crying all those tears\nWell, I want you to know girl\nI'm around\nYeah I'm here alright\nAlright\n\nI wanna know\nIf you want to get together\nStay for a while\nWe can talk about it all\nI wanna know\n'Cause this feeling won't let me go\n\nI wanna know (I wanna know, I wanna know, I wanna know)\nI wanna know\nI wanna know (I wanna know, I wanna know, I wanna know)\nI wanna know, baby\n\nAll of these feelings\nNo it won't\nNo it won't let me go\nNo it won't baby\nIt won't let me go",
      moods : [ "soul", "folk", "blues" ],
      time : "3:04",
      title : "Won't Let Me Go",
      set: 1
    },{
      artist : "Radiohead",
      id : "-Kc_tvYsayUwD905hXhs",
      lyrics : "Karma police, arrest this man\nHe talks in maths\nHe buzzes like a fridge\nHe's like a detuned radio\n\nKarma police, arrest this girl\nHer Hitler hairdo is\nMaking me feel ill\nAnd we have crashed her party\n\nThis is what you get\nThis is what you get\nThis is what you get when you mess with us\n\nKarma Police\nI've given all I can\nIt's not enough\nI've given all I can\nBut we're still on the payroll\n\nThis is what you get\nThis is what you get\nThis is what you get when you mess with us\n\nAnd for a minute there, I lost myself, I lost myself\nAnd for a minute there, I lost myself, I lost myself\n\nFor for a minute there, I lost myself, I lost myself\nFor for a minute there, I lost myself, I lost myself\nPhew, for a minute there, I lost myself, I lost myself\n\n\n\nAll lyrics are property and copyright of their owners.\n  Tyxo.bg counter",
      moods : [ "slow", "sublime", "alternative" ],
      time : "3:35",
      title : "Karma Police",
      set: 2
    }, {
      artist : "Roberta Flack",
      id : "-Kc_te2xOBwIxVvn3kPN",
      lyrics : "Strumming my pain with his fingers\nSinging my life with his words\nKilling me softly with his song\nKilling me softly with his song\nTelling my whole life with his words\nKilling me softly with his song\n\nI heard he sang a good song\nI heard he had a style\nAnd so I came to see him \nAnd listen for a while\nAnd there he was this young boy\nA stranger to my eyes\n\n{Refrain}\n\nI felt all flushed with fever\nEmbarrassed by the crowd\nI felt he found my letters \nAnd read each one out loud\nI prayed that he would finish\nBut he just kept right on\n\n{Refrain}\n\nHe sang as if he knew me\nIn all my dark despair\nAnd then he looked right through me\nAs if I wasn't there\nAnd he just kept on singing\nSinging clear and strong\n\n{Refrain}\n\n",
      moods : [ "slow", "soul", "rnb" ],
      time : "4:20",
      title : "Killing Me Softly",
      set: 2
    }, {
      artist : "Leonard Cohen",
      id : "-KcalL-TLCRaahj7GsyK",
      lyrics : "Now I've heard there was a secret chord \nThat David played, and it pleased the Lord \nBut you don't really care for music, do you \nIt goes like this \nThe fourth, the fifth \nThe minor fall, the major lift \nThe baffled king composing Hallelujah \nHallelujah \nHallelujah \nHallelujah \nHallelujah \n\nYour faith was strong but you needed proof \nYou saw her bathing on the roof \nHer beauty and the moonlight overthrew her \nShe tied you \nTo a kitchen chair \nShe broke your throne, and she cut your hair \nAnd from your lips she drew the Hallelujah \n\nHallelujah, Hallelujah \nHallelujah, Hallelujah \n\nYou say I took the name in vain \nI don't even know the name \nBut if I did, well really, what's it to you \nThere's a blaze of light \nIn every word \nIt doesn't matter which you heard \nThe holy or the broken Hallelujah \n\nHallelujah, Hallelujah \nHallelujah, Hallelujah \n\nI did my best, it wasn't much \nI couldn't feel, so I tried to touch \nI've told the truth, I didn't come to fool you \nAnd even though \nIt all went wrong \nI'll stand before the Lord of Song \nWith nothing on my tongue but Hallelujah \n\nHallelujah, Hallelujah \nHallelujah, Hallelujah \nHallelujah, Hallelujah \nHallelujah, Hallelujah \nHallelujah, Hallelujah \nHallelujah, Hallelujah \nHallelujah, Hallelujah \nHallelujah, Hallelujah \nHallelujah\n\n",
      moods : [ "slow", "sublime", "folk" ],
      time : "3:45",
      title : "Hallelujah",
      set: 2
    },{
      artist : "Led Zeppelin",
      id : "-KcanGhSDzoRZ5MlZ55-",
      lyrics : "If it keeps on rainin', levee's goin' to break, [X2]\nWhen The Levee Breaks I'll have no place to stay. \n\nMean old levee taught me to weep and moan, [X2]\nGot what it takes to make a mountain man leave his home, \nOh, well, oh, well, oh, well. \n\nDon't it make you feel bad \nWhen you're tryin' to find your way home, \nYou don't know which way to go \nIf you're goin' down South \nThey go no work to do, \nIf you don't know about Chicago. \n\nCryin' won't help you, prayin' won't do you no good, \nNow, cryin' won't help you, prayin' won't do you no good, \nWhen the levee breaks, mama, you got to move. \n\nAll last night sat on the levee and moaned, [X2]\nThinkin' about me baby and my happy home. \nGoing, going to Chicago... Going to Chicago... Sorry but I can't take you... \nGoing down... going down now... going down....",
      moods : [ "blues", "rock", "sublime" ],
      time : "5:23",
      title : "When the Levee Breaks",
      set: 3
    }, {
      artist : "Leonard Cohen",
      id : "-Kcal2xNr6UrKRW8fTp5",
      lyrics : "Suzanne takes you down to her place near the river \nYou can hear the boats go by \nYou can spend the night beside her \nAnd you know that she's half crazy \nBut that's why you want to be there \nAnd she feeds you tea and oranges \nThat come all the way from China \nAnd just when you mean to tell her \nThat you have no love to give her \nThen she gets you on her wavelength \nAnd she lets the river answer \nThat you've always been her lover \nAnd you want to travel with her \nAnd you want to travel blind \nAnd you know that she will trust you \nFor you've touched her perfect body with your mind. \nAnd Jesus was a sailor \nWhen he walked upon the water \nAnd he spent a long time watching \nFrom his lonely wooden tower \nAnd when he knew for certain \nOnly drowning men could see him \nHe said \"All men will be sailors then \nUntil the sea shall free them\" \nBut he himself was broken \nLong before the sky would open \nForsaken, almost human \nHe sank beneath your wisdom like a stone \nAnd you want to travel with him \nAnd you want to travel blind \nAnd you think maybe you'll trust him \nFor he's touched your perfect body with his mind. \n\nNow Suzanne takes your hand \nAnd she leads you to the river \nShe is wearing rags and feathers \nFrom Salvation Army counters \nAnd the sun pours down like honey \nOn our lady of the harbour \nAnd she shows you where to look \nAmong the garbage and the flowers \nThere are heroes in the seaweed \nThere are children in the morning \nThey are leaning out for love \nAnd they will lean that way forever \nWhile Suzanne holds the mirror \nAnd you want to travel with her \nAnd you want to travel blind \nAnd you know that you can trust her \nFor she's touched your perfect body with her mind.",
      moods : [ "slow", "sublime", "folk" ],
      time : "2:40",
      title : "Suzanne",
      set: 3
    }],
    title : "My Austin Gig"
  };
    firebase.auth().onAuthStateChanged(
      user => {
        let uid=0;
        if(user){
          // console.log('user: ',user);
          this.setState({
            uid:user.uid
            // userpic:user.photoURL
          });
          uid=user.uid;

          let playing ='';
          firebase.database()
            .ref('/users/'+uid+'/playing/')
            .on('value',(data)=>{
              let result = data.val();
              // console.log('now actually playing: ',result);
              this.setState({
                playing:result
              });
            });
              playing = this.state.playing;
              // console.log('playing has been reset to: ',playing);
              //retrieve all existing gigs from the database:


              firebase.database()
              .ref('/'+uid)
              .on('value',(data)=>{
                    let snapshot = data.val();
                    let user = firebaseListToArray(snapshot);
                    // console.log('user: ',user);
                    let gigs = firebaseListToArray(snapshot.gigs);
                    // console.log('the gigs we are working with are: ',gigs);


                    // Compile a single array of all the songs in the user's default gig:
                    let usr_default_gig = [];

                    if(!playing) {
                      usr_default_gig = defaultgig;
                    }else{
                          gigs.forEach((val)=>{
                            // console.log('playin id: ',val.id);
                            // console.log('playing: ',playing);

                                if(playing===val.id){
                                  // console.log('match!!!!!');
                                  // console.log('this gig is: ',val);
                                  usr_default_gig = val.gig;
                                }
                          });
                    }
                    // console.log('the default gig we are working with is: ',usr_default_gig);
                    let usr_default = [];
                    usr_default_gig.sets.forEach((val)=>{
                      usr_default = usr_default.concat(val);
                    });
                    // Pass both the song and set arrays to the state:
                    this.setState({
                      songs:usr_default,
                      gig:usr_default_gig
                    });
                    // console.log('the Dash CWM songs: ',this.state.songs);
              });
        }else{
          hashHistory.push('/');
        }
  //       // console.log('user is logged as: ',this.state.uid);

      });

  }


  componentDidMount(){

    // let totaltime = 163520000;
    // console.log('totaltime: ',totaltime);
    // totaltime = moment(totaltime).format("m:ss");
    // console.log('total: ',totaltime);


    let hrs = 4;
    let min = 35;
    let sec = 23;

    let newmin = 30;
    newmin = moment.duration({minutes:newmin})._milliseconds;
    // let sec = 23;
    hrs = moment.duration({hours:hrs})._milliseconds;
    min = moment.duration({minutes:min})._milliseconds;
    sec = moment.duration({seconds:sec})._milliseconds;
    // sec = moment.duration({seconds: sec})._milliseconds;
    console.log('hrs: ',hrs);
    console.log('min: ',min);
    console.log('sec: ',sec);
    let final = hrs + min + sec;
    console.log('final: ',final);
    final+=newmin;
    // console.log('sec: ',sec);
    // let full = hrs+sec;
    let full = moment.duration(final);
    let y = full.hours() + ':'+ full.minutes() + ':' + full.seconds();
    // hrs = moment(hrs).format("h:mm:ss");
    // full = moment(full).format("m:ss");
    console.log('final hrs: ',y);


    // console.log('final full time: ',full);
    // full = moment.duration({minutes: full})._milliseconds;
    // console.log('full to milliseconds: ',full);


    // let defaultsongs2 = this.state.songs;
    // let defaultsongs = [];
    // for(let i=0; i<defaultsongs2.length; i++){
    //   defaultsongs.push(defaultsongs2[i]);
    // }

    // console.log('the defaultsongs state: ',defaultsongs2);
    //
    // let gigtitle = 'My Fat Gig';
    // let maxminutes = 35;
    // //format in moment.js
    // maxminutes = moment.duration(maxminutes+':00')._milliseconds;
    // console.log('the maximum number of minutes allowed:',maxminutes);
    // //
    // let genresdesired = this.state.genres;
    // console.log('genres are: ',genresdesired);
    // let setsdesired = 3;
    // makesets.updateGig(defaultsongs2,gigtitle,maxminutes,genresdesired,setsdesired);
    // console.log('the default gig on Dashboard: ',this.state.gig);

}
  navigate(id){
    this.setState({
      target:id
    });
  }

  render(){
    //create JSX for songs to pass to SongArea:
    let mysongs = this.state.songs;
    let target = this.state.target;
    // console.log('target in render: ',target);
    //create JSX for separate set lists to pass to SetList:
    let mygig = this.state.gig;
    let html = (mysongs && mygig) ?
    <div className="row">
    <SetList scroll={this.navigate.bind(this)} id={this.state.uid} gig={mygig}/>
    <SongArea songs={mysongs} target={target}/>
    </div>
    : '';
    // console.log('dashboard render gig: ',mygig);
    // let songs = this.state.songs;


    return(
      <div>
        <div className="wrapper container landed_content">
          { html }
        </div>
      </div>
    );
  }
}

export default Dashboard;
