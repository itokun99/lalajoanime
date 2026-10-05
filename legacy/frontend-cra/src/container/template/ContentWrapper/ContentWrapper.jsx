import React, {Component} from 'react';
import style from './ContentWrapper.module.css';


const ContentWrapper = (ContentMain) => {
  return(
    class Content extends Component {
      render(){
        return(
          <div className={style.contentSection}>
            <ContentMain {...this.props} />
          </div>
        )
      }
    }
  );
}

export default ContentWrapper;