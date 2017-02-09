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
  render(){
    let gigInfo = '';

    if(this.state.gig){
      let gig = this.state.gig;
      // console.log('the gig in SetList.js: ',gig);
        let frame=[];
        let setnum=1;
        // console.log('our sets saved in state: ',this.state.sets);
        for (var property in gig.sets) {
            if (gig.sets.hasOwnProperty(property)) {
              let  goods=[];
              gig.sets[property].map((val)=>{
                // console.log('the setss song is: ',val);
                goods.push(<li id={val.id}>{val.title}</li>);
              });
                frame.push(
                  <div className="set">
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
