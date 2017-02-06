import React, { Component } from 'react';

class SetList extends Component {
  render(){
    return(
      <div className="col-sm-5 set_list">
        <h1>Antone's Gig</h1>
        <div className="set">
          <h3>Set</h3>
          <ul>
            <li>Song1</li>
            <li>Song2</li>
            <li>Song3</li>
            <li>Song4</li>
          </ul>
        </div>
        <div className="set">
          <h3>Set</h3>
          <ul>
            <li>Song1</li>
            <li>Song2</li>
            <li>Song3</li>
            <li>Song4</li>
          </ul>
        </div>
      </div>
    );
  }

}


export default SetList;
