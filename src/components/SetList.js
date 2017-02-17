import React, { Component } from 'react';

class SetList extends Component {
  constructor(props){
    super(props);
    this.state={
      uid:0
    }
  }
  componentDidMount(){
    let theGig=this.props.gig;
    // console.log('setlist CWM sets: ',theSets);
    this.setState({
      gig:theGig
    });
    // console.log('the SetList gig: ',this.state.gig);
  }
  handleClick(e){
    e.preventDefault();
    let id = e.target.id;
    console.log('id in setlist: ',id);
    this.props.scroll(id);
  }
  render(){
    let gigInfo = '';

    if(this.state.gig){
      let gig = this.props.gig;
      // console.log('the gig in SetList.js: ',gig);
        let frame=[];
        let setnum=1;
        let maxsets = parseInt(gig.setnum);
        console.log('maxsets: ',maxsets);
        let sets = gig.sets;
        // console.log('our sets saved in state: ',this.state.sets);
        // for (var property in gig.sets) {
        //     if (gig.sets.hasOwnProperty(property)) {
        //       let  songs=[];
        //       gig.sets[property].map((val)=>{
        //         // console.log('the setss song is: ',val);
        //         songs.push(<a href="#" onClick={this.handleClick.bind(this)}><li id={val.id}>{val.title}</li></a>);
        //       });
        //         frame.push(
        //           <div className="set">
        //           <h3>Set {setnum}</h3>
        //           <ul>
        //             {songs}
        //           </ul>
        //         </div>
        //         );
        //         setnum++;
        //     }
        // }

        //=======================================================
        for(let x=0; x<maxsets; x++){
          let  goods=[];
          // go through every song in the gig:
          for (var song =0; song<sets.length; song++) {
            console.log('the song to iterate through: ',sets[song]);
            if (sets.hasOwnProperty(song)) {
            // check if song has current gig number
              if(sets[song].set===setnum){
                console.log('yes its running');
                //create the ESX for that set
                // goods.push(<li>{sets[song].title}</li>);
                goods.push(<a href="#" onClick={this.handleClick.bind(this)}><li id={sets[song].id}>{sets[song].title}</li></a>);

              }
            }
          }
          frame.push(
            <div className="set">
            <h3>Set {setnum}</h3>
            <ul>
              {goods}
            </ul>
          </div>
          );
          //increase the set number
          setnum++;
        }
        //=======================================================


        gigInfo = (
          <div className="col-sm-6 set_list">
          <h1>{this.state.gig.title}</h1>
          <ul>
            { frame }
          </ul>
        </div>
      );
    }

    return(
    <div>
      { gigInfo }
    </div>
    );

  }
}


export default SetList;
