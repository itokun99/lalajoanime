import React, {Component} from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import style from './Wrapper.module.css';


const SiteWrapper = (Content) => {
  return(
    class Wrapper extends Component {
      render(){
        return(
          <div className={style.siteWrapper}>
            <div className={style.siteContent}>
              <Header {...this.props} />
              <Content {...this.props} />
              <Footer {...this.props} />
            </div>
          </div>
        )
      }
    }
  )
}

export default SiteWrapper;