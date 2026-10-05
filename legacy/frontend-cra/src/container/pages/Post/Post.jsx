import React, {Component} from 'react';
import {GlobalConsumer} from '../../../context/Context';
import ContentWrapper from '../../template/ContentWrapper/ContentWrapper';
import style from './Post.module.css';
import AnimePost from '../../../component/AnimePost/AnimePost';
import AnimeAPI from '../../../service/Service';
import Loading from '../../../component/LoadingScreen/Loading';

class Post extends Component {
  state = {
    anime : {}
  }
  
  handleLinkToPlayer = (dataObj) => {
    this.props.history.push(`/anime/${dataObj.anime_mal_id}/${dataObj.anime_title}/${dataObj.anime_play_id}/${dataObj.anime_play_title}`, dataObj.anime_play_data)
  }
  
  componentDidMount(){
    document.getElementsByTagName('html')[0].scrollTop = 0
    let anime = this.props.history.location.state;
    if(typeof(anime) !== "undefined"){
      this.setState({
        anime : anime
      }, () => {
        document.title = this.state.anime.anime_title
      })
    } else {
      let anime_mal_id = this.props.match.params.id;
      let params = {
        mal_id : anime_mal_id
      }
      AnimeAPI.getAnime(params).then((response) => {
        if(response.status === true){
          let anime = response.data[0];
          this.setState({
            anime : anime
          }, () => {
            document.title = this.state.anime.anime_title
          })
        } else {
          console.log(response);
        }
      }, (error) => {
        console.log(error);
      })
    }
  }
  
  render(){
    return(
      <div data-id={this.state.anime.anime_id} className={style.postSection}>
        <div className={style.postRow}>
           <div className={style.postLeft}>
            {
              this.state.anime.hasOwnProperty("anime_id") ? 
              <>
                <Loading willHide={{transition : 1, opacity : 0, zIndex : -10}} />
                <AnimePost anime = {this.state.anime} linkToPlayer={(data) => this.handleLinkToPlayer(data)} />
              </>
              :
              <Loading /> 
            }
           </div>
           <div className={style.postRight}>
             
           </div>
        </div>
      </div>
    );
  }
}


export default GlobalConsumer(ContentWrapper(Post));