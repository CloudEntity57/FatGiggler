import React, { Component } from 'react';
import {firebase} from '../utils/firebase';

class SongTab extends Component{

  delete(e){
    e.preventDefault();
    console.log('deleting song!');
    let uid=this.props.uid;
    let songid = e.target.id;
    console.log('song id: ',songid);
    // firebase.database()
    // .ref('/'+uid+'/songs/'+songid)
    // .on('value',(data)=>{
    //   console.log('the target to delete: ',data);
    //   if(confirm('Are you sure?')){
    //     data.ref.remove();
    //     // console.log('destroying song from db');
    //   }
    // });

      if(confirm('Are you sure?')){
        firebase.database()
        .ref('/'+uid+'/songs/'+songid).ref.remove();
        // console.log('destroying song from db');
      }
  }

  render(){
    let deleteButton = (this.props.editing) ? (<div id={this.props.id} onClick={this.delete.bind(this)} className="fa fa-minus-circle song-del-button"></div>)
    : '';
    return(
      <div id={this.props.id} className="song-icon col-xs-6 col-sm-4">
        {deleteButton}
        <div onClick={this.props.clicked} >
        <a id={this.props.id} href="#" >
          <div id={this.props.id} className="song-box row">
            <div id={this.props.id} className="song-info col-xs-7 col-md-8">
            <div id={this.props.id}>{this.props.title}</div><p id={this.props.id}> - {this.props.artist}</p>
            </div>
            <div id={this.props.id} className="song-img col-xs-5 col-md-4">
              <img id={this.props.id} src={this.props.pic} />
            </div>
          </div>
        </a>
      </div>
      </div>
    );
  }
}

export default SongTab;
