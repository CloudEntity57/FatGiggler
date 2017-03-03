import React, { Component } from 'react';

class EditGenres extends Component{
  cancel(e){
    e.preventDefault();
    this.props.cancel();
  }
  render(){
    return(
      <div className="genre-edit">
        <div>
          Genres: {this.props.moods}
        </div>
        <button className="btn-xs btn-primary" onClick={this.cancel.bind(this)}>Cancel</button>
      </div>
    );
  }
}

export default EditGenres;
