
import axios from 'axios';
import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

const KeyCodes = {
  comma: 188,
  enter: [10, 13],
};
const delimiters = [...KeyCodes.enter, KeyCodes.comma];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      tag: '',
      number: null,
      errormessage: '',
      images: [{original: "https://picsum.photos/id/1018/1000/600/", thumbnail: "https://picsum.photos/id/1018/250/150/"}],
      tags: [
        { id: "Thailand", text: "Thailand" },
        { id: "India", text: "India" }
      ],
      suggestions: [
        { id: 'Costa Rica', text: 'Costa Rica' },
        { id: 'Italy', text: 'Italy' },
        { id: 'Canada', text: 'Canada' }
      ]
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }
  /*Delete tag from input value*/
  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
     tags: tags.filter((tag, index) => index !== i),
    });
  }
  /*Add tag from input value*/
  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }
  /*Make tags draggable*/
  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    this.setState({ tags: newTags });
  }
  /*Get request to server that returns response containing public photos from Flickr API*/
  getPhotos = (tags, number) => {
    var tag = "";
    tags.map((item, index) => {
      if (index < (tags.length-1)) {
        var path = item.text + encodeURIComponent(",");
      } else {
        var path = item.text;
      }
      tag += path;
    });
    console.log(tag);
    var call = axios.get("http://localhost:5000/search?tag=" + tag + "&number=" + number)
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
      let image = "https://live.staticflickr.com/" + server + "/" + id + "_" + secret + "_" + size + ".jpg"
      console.log(image);
      //list.push(<img key={id} src={image}></img>);
      list.push({original: image, thumbnail: image})
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
    if (!tags) {
      err = <strong>Please enter a tag.</strong>;
      console.log(tag);
      this.setState({errormessage: err});
    } else {
      let photos = this.getPhotos(tags, number);
      var that = this;
      photos.then(function(result) {
        console.log(result);
        that.setState({images: result});
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
    return (
      <div className="App">
      <div className="Form">
      <form onSubmit={this.submitHandler}>
        <p>Enter a tag: </p>
        <ReactTags name='tag' 
          tags={tags} 
          suggestions={suggestions} 
          handleDelete={this.handleDelete} 
          handleAddition={this.handleAddition} 
          handleDrag={this.handleDrag} 
          delimiters={delimiters} 
          onChange={this.formChangeHandler}/>
        <p>Enter the number of results to return: </p>
        <input type='number' name='number' min='1' max='10' onChange={this.formChangeHandler} />
        <br></br>
        {this.state.errormessage}
        <input type='submit' />
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
