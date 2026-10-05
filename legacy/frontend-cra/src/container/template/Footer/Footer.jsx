import React, {Component} from 'react';
import style from './Footer.module.css';

class Footer extends Component {
  render(){
    return(
      <footer className={style.footer}>
        <div>
          <p>Credit by Itonamikaze @codepelajar</p>
        </div>
      </footer>
    )
  }
}

export default Footer;