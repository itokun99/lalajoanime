import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import style from './Header.module.css';

class Header extends Component  {
  state = {
    menuToggle : false,
  }
  
  handleMenuToggle = () => {
    this.setState({
      menuToggle : !this.state.menuToggle
    }, () => {
      console.log(this.state.menuToggle);
    })
  }
  
  render(){
    return(
      <header className={style.headerSection}>
        <div className={style.headerRow}>
          <div className={style.headerLeft}>
            <div className={style.headerBrand}>
              <h1 className={style.headerTitle}>
                <Link to="/">Weboonime</Link>
              </h1>
            </div>
            <span onClick={() => this.handleMenuToggle() } className={this.state.menuToggle ? style.menuToggle +" "+ style.active : style.menuToggle}>
              <span></span>
              <span></span>
              <span></span>
            </span>            
          </div>
          <div className={style.headerRight}>
            <nav className={this.state.menuToggle ? style.headerNavigation + " " + style.active : style.headerNavigation }>
              <ul onClick={() => this.handleMenuToggle() }>
                <li className={style.cureentNav}><Link to='/'>Home</Link></li>
                <li><Link to='/anime-list'>AnimeList</Link></li>
                <li><Link to='/'>About</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;