import React, {Component} from 'react';

class SubmitModal extends Component{
  componentDidMount(){
    window.setTimeout(this.props.hide,1000);
  }
  render(){
    let text=(this.props.text) ? this.props.text : ''
    return(
      <div className="submitModal">{text}</div>
    );
  }
}

export default SubmitModal;
