import React from 'react';
import style from './Loading.module.css';

class Loading extends React.Component {
  state = {
    isHide : false
  }
  render(){
    return(
      <div className={style.loading} style={this.props.willHide}>
        <div className={style.loadingIcon}>
          <span>Loading...</span>
        </div>
      </div>
    )
  }
}

export default Loading;