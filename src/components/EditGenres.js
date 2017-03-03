import React, { Component } from 'react';

class EditGenres extends Component{
  constructor(props){
    super(props);
    this.state={
      genrearray:this.props.genrearray,
      genres:[]
    }
  }
  cancel(e){
    e.preventDefault();
    this.props.cancel();
  }
  testValue(x,array){
    for(let i=0; i<array.length; i++){
      if(x==array[i]){
        return true;
      }
    }
    return false;
  }
  removeValue(x,array){
    for(let i=0; i<array.length; i++){
      if(x==array[i]){
        array.splice(i,1);
      }
    }
  }
  addGenre(e){
      e.preventDefault();
      // e.target == document.querySelector(), $('').text()
      let genre = e.target.id;
      let current_genres = this.state.genres;
          //loop through array and test if genre is already there
          //if yes, remove it:
         if(this.testValue(genre,current_genres)){
           this.removeValue(genre,current_genres);
         }else{
          //if no, push it to genres:
          current_genres.push(genre);
         //  console.log('current genres: ',current_genres);
          this.setState({
            genres:current_genres
          });
         }
      //update the current genres array in state:
      this.setState({
        genres:current_genres
      });
      //display the current genres user has selected in the input
      current_genres = current_genres.join(', ');
      this.refs.genresdesired.value=current_genres;

  }
  render(){
    let genrearray = this.state.genrearray;
    let genres = genrearray.join(',');
    return(
      <div className="genre-edit">
        <div className="genre-modal">

          <div className="form-group">
            <label for="genre-input">Genres Desired</label>
            <input className="form-control" ref="genresdesired" type="text" defaultValue={genres} id="add-genre"></input>
            <div className="form-group add-genres">


            </div>
            <div className="buttons">
            <button id="blues" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs" >Blues</button>
            <button id="slow" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Slow</button>
            <button id="upbeat" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Upbeat</button>
            <button id="funk" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Funk</button>
            <button id="sublime" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Sublime</button>
            <button id="rock" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Rock</button>
            <button id="folk" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Folk</button>
            <button id="alternative" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Alternative</button>
            <button id="jazz" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Jazz</button>
            <button id="rnb" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Hip Hop/R&B</button>
            <button id="rap" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Rap</button>
            <button id="soul" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Soul</button>
            <button id="other" onClick={this.addGenre.bind(this)} className="btn btn-primary btn-xs">Other</button>
          </div>
          </div>
          <button className="btn-xs btn-primary" onClick={this.cancel.bind(this)}>Cancel</button>
        </div>

      </div>
    );
  }
}

export default EditGenres;
