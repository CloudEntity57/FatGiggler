import React, { Component } from 'react';

class Minutes extends Component{
  constructor(props){
    super(props);
    this.state={
      gigminutes:''
    }
  }
  componentDidMount(){
    let arr = [];
    for(let i=0;i<=240;i++){
      arr.push("<option value='2'>2</option>");
    }
    let minutes = arr.join('');
    this.setState({
      gigminutes:minutes
    });
    console.log('state minutes: ',this.state.gigminutes);
  }
  render(){
    return(
      <optgroup label="Choose">
        <option value="1">1</option>
        {this.state.gigminutes}
      </optgroup>

    );
  }

}

export default Minutes;
