import React, {Component} from 'react';

class SubmitModal extends Component{
  componentDidMount(){
    window.setTimeout(this.props.hide,1000);
  }
  render(){
    return(
      <div className="submitModal">Submitted</div>
    );
  }
}

export default SubmitModal;
