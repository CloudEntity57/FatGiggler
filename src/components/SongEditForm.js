import React, { Component } from 'react';
import SubmitModal from './SubmitModal';
import EditGenres from './EditGenres';

class SongEditForm extends Component{
  constructor(props){
    super(props);
    this.state={
      editgenres:false,
      submitted:false
    }
  }
  submit(e){
    e.preventDefault();
    let title= this.refs.title.value;
    let lyrics= this.refs.lyrics.value;
    let artist= this.refs.artist.value;
    this.props.submit(title,lyrics,artist);
  }
  componentWillMount(){
    console.log('moods: ',this.props.genres);
    let data = this.props.genres;
    let moods = data.map((val)=>{
      return (
        <button className="btn-xs btn-primary">{val}</button>
      );
    });
    this.setState({
      moods:moods,
      genrearray:data
    });
  }
  editGenres(e){
    e.preventDefault();
    this.setState({
      editgenres:true
    });
  }
  cancelGenreEdit(){
    this.setState({
      editgenres:false
    });
  }
  hideModal(){
    this.setState({
      submitted:false
    });
  }
 render(){
    let please_login = (this.state.submitted) ? (<SubmitModal text={this.state.modaltext} hide={this.hideModal.bind(this)}/>) : '';
    let moods = this.state.moods;
    let genrearray = this.state.genrearray;
    let currentgenres = genrearray.join(', ');
    let genres = (this.state.editgenres) ? (<EditGenres cancel={this.cancelGenreEdit.bind(this)} genrearray={genrearray} moods={moods} />)
    :(<button onClick={this.editGenres.bind(this)} className="btn-xs btn-primary">Edit Genres</button>);

    return(
      <div className="song-update-form">
      <form id={this.props.id} onSubmit={this.submit.bind(this)} className="song-edit-form form form-default">

        <button type="submit" className="btn-xs btn-success">Submit</button>
        <div>
          Genres: {currentgenres}
        </div>
        {genres}
        <input ref="title" className="form-control" defaultValue={this.props.title} />
        <input ref="artist" className="form-control" defaultValue={this.props.artist}/>
        <textarea ref="lyrics" className="form-control song-edit-text" defaultValue=
          {this.props.lyrics} />
        <button type="submit" className="btn-xs btn-success">Submit</button>
        <br></br>
        <br></br>
      </form>
      {please_login}
      </div>
    );
  }
}

export default SongEditForm;
