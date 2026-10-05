import React, {Component} from 'react';
import ReactPlayer from 'react-player';

class CustomPlayer extends Component {
  render(){
    return(
      <div className="custom">
        <video>
          <source src={this.props.videoUrl}></source>
        </video>
      </div>
    )
  }
}

export default CustomPlayer;