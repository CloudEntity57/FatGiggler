import React, { Component } from 'react';

class SetList extends Component {
  constructor(props){
    super(props);
    this.state={
      uid:0
    }
  }
  componentWillMount(){
    let theGig=this.props.gig;
    // console.log('setlist CWM sets: ',theSets);
    this.setState({
      gig:theGig
    });
    console.log('the SetList gig: ',this.state.gig);
  }
  render(){
    let gigInfo = '';

    if(this.state.gig){
      let gig = this.state.gig;
      // console.log('the sets in SetList.js: ',sets);
        let frame=[];
        let setnum=1;
        // console.log('our sets saved in state: ',this.state.sets);
        for (var property in gig) {

            if (gig.sets.hasOwnProperty(property)) {
              let  goods=[];
              gig.sets[property].map((val)=>{
                // console.log('the setss song is: ',val);
                goods.push(<li>{val.title}</li>);
              });
                frame.push(
                  <div>
                  <h3>Set {setnum}</h3>
                  <ul>
                    {goods}
                  </ul>
                </div>
                );
                setnum++;
            }
        }

        gigInfo = (
          <div>
          <h2>{this.state.gig.title}</h2>
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
