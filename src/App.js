
import axios from 'axios';
import React, { Component } from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import * as Mui from '@material-ui/core';
import * as Mlab from '@material-ui/lab';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      tag: '',
      number: null,
      errormessage: '',
      images: [{original: "https://picsum.photos/id/1018/1000/600/", thumbnail: "https://picsum.photos/id/1018/250/150/"}], //Placeholder image
      tags: [],
      suggestions: ['Canada', 'Italy', 'Vietnam', 'Peru', 'South Africa'],
      loading: false
    };
    this.onTagsChange = this.onTagsChange.bind(this);
  }
  /*Set tags based on input changes*/
  onTagsChange = (event, values) => {
    this.setState({
      tags: values
    }, () => {
      //This will output an array of objects given by Autocompelte options property.
      console.log(this.state.tags);
    });
  }
  /*Get request to server that returns response containing public photos from Flickr API*/
  getPhotos = (tags, number) => {
    var tag = "";
    tags.map((item, index) => {
      if (index < (tags.length-1)) {
        var path = encodeURIComponent(item) + encodeURIComponent(",");
      } else {
        var path = encodeURIComponent(item);
      }
      tag += path;
    });
    console.log(tag);
    //Make API call
    var call = axios.get("https://photo-bomb-app.herokuapp.com/search?tag=" + tag + "&number=" + encodeURIComponent(number))
    .then(response => {
      console.log(response);
      console.log(response.status);
      var data = response.data;
      var images = this.displayPhotos(data);
      return (images);
    })
    .catch(error => {
      console.log(error);
    });
    console.log(call);
    return (call);
  }
  displayPhotos = (photos) => {
    let list = [];

    photos.forEach((photo) => {
      let server = photo.server;
      let id = photo.id;
      let secret = photo.secret;
      let size = "b";
      let image = "https://live.staticflickr.com/" + server + "/" + id + "_" + secret + "_" + size + ".jpg";
      console.log(image);
      //list.push(<img key={id} src={image}></img>);
      list.push({original: image, thumbnail: image}); //Add image path to list
    });
    console.log(list);
    return (list);
  }
  /*Return images to be rendered*/
  listImages = () => {
    console.log(this.state.images);
    return this.state.images;
  }
  /*Event handler on submit button*/
  submitHandler = (event) => {
    event.preventDefault();
    let tag = this.state.tag;
    let tags = this.state.tags;
    console.log(tags);
    let number = this.state.number;
    let err = "";
    this.setState({ loading: true});
    if (tags.length === 0) {
      err = <strong>Please enter a tag.</strong>;
      console.log(tag);
      this.setState({errormessage: err}); //Display error if tag input is empty
    } else {
      this.setState({errormessage: ""});
      let photos = this.getPhotos(tags, number);
      var that = this;
      photos.then(function(result) {
        that.setState({loading: false});
        console.log(result);
        that.setState({images: result}); //Set state for returned set of images
        that.listImages();
      });
    }
  }
  /*Event handler on form*/
  formChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }
  render() {
    const {tags, suggestions} = this.state;
    const images = this.state.images;
    console.log(images);
    const {loading} = this.state;
    return (
      <div className="App">
      <div className="Header">
        <Mui.Typography variant="h2">PhotoBomb</Mui.Typography>  
      </div>
      <div className="Form">
      <form onSubmit={this.submitHandler}>
        <p>Enter a tag: </p>
        <Mlab.Autocomplete
          multiple
          freeSolo
          required
          options={suggestions}
          onChange={this.onTagsChange}
          renderInput={params => (
            <Mui.TextField
              {...params}
              variant="standard"
              label="Tags"
              margin="normal"
              fullWidth
            />
          )}
        />
        <p>Enter the number of results to return: </p>
        <Mui.TextField type='number' name='number' id="number" required
          InputProps={{inputProps: { max: 10, min: 1 }}} label="Number" variant="standard" margin="normal" fullWidth
          onChange={this.formChangeHandler}
        />
        <br></br>
        <p>{this.state.errormessage}</p>
        <br></br>
        <Mui.Button variant="contained" type='submit' disabled={loading}>Submit</Mui.Button>
        <br></br>
        <br></br>
        {loading && <Mui.CircularProgress />}
      </form>
      </div>
      <div className="Results">
      <ImageGallery items={images} />
      </div>
      </div>
    );
  }
}

export default App;
