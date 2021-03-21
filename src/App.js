import React from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import FaceRecognization from './components/FaceRecognization/FaceRecognization';
import Logo from './components/logo/Logo';
import SignIn from './components/SignIn/SignIn';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import Particles from 'react-particles-js';
import './App.css';

const app = new Clarifai.App({
  apiKey: '6a9ca4f22d5d42cda0097608911ee2db'
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin'
    }
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    //console.log(clarifaiFace);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    console.log(width);
    const height = Number(image.height);
    console.log(height);
    return {
      leftCol: Number(clarifaiFace.left_col * width),
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row) * height
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  }



  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }



  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(
        response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));

  }
  onRouteChange = (route) => {
    this.setState({route: route});
  }
  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={{
            particles: {
              number: {
                value: 30,
                density: {
                  enable: true,
                  value_area: 800
                }

              }
            }
          }} />

        <Navigation onRouteChange = {this.onRouteChange} />
        {
          this.state.route === 'signin' ?
            <SignIn onRouteChange  = {this.onRouteChange}/> :
         <div> <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
        <FaceRecognization box ={this.state.box}  imageUrl={this.state.imageUrl} />
          </div>
        }

      </div>
    );
  }

}

export default App;
