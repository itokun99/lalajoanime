import React, {Component} from 'react';
import style from './PlayerPage.module.css';
import AnimeVideoPlayer from '../../../component/AnimeVideoPlayer/AnimeVideoPlayer';
import AnimePlayList from '../../../component/AnimePlayList/AnimePlayList';
import AnimeAPI from '../../../service/Service';

class PlayerPage extends Component {
  
  state = {
    anime : {},
    currentEpisode : {},
    allPlayList : [],
  }
  
  handleChangeVideo = (data) => {
    this.setState({
      currentEpisode : data
    })
  }
  
  handleGetCurrentPlayVideo = (play_id) => {
    if(this.state.allPlayList.length > 0){
      this.state.allPlayList.map((playlist) => {
        if(playlist.play_id === play_id){
          this.setState({
            currentEpisode : playlist
          })
          return true
        } else {
          return false
        }
      })
    }
  }
  handleGetAnimeData = (anime_mal_id, play_id) => {
    let params = {
      mal_id : anime_mal_id
    }
    AnimeAPI.getAnime(params).then((response) => {
      if(response.status === true){
        let anime = response.data[0]
        let allPlayList = anime.anime_play_data.play360
        let currentEpisode = {} 
        allPlayList.map((playlist) => {
          if(playlist.play_id === play_id){
            currentEpisode = playlist
            return currentEpisode 
          } else {
            return false
          }
        })
        this.setState({
          anime : response.data[0],
          currentEpisode : currentEpisode,
          allPlayList : allPlayList, 
        })
      }
    })
  }
  
  componentDidMount = () => {
    if(typeof(this.props.location.state) !== "undefined"){
      let anime = this.props.location.state.anime;      
      let currentEpisode = this.props.location.state.currentPlay;
      let allPlayList = this.props.location.state.anotherList;
      this.setState({
        anime : anime,
        currentEpisode : currentEpisode,
        allPlayList : allPlayList,
      })
    } else {
      let mal_id = this.props.match.params.id;
      let play_id = this.props.match.params.play_id;
      this.handleGetAnimeData(mal_id, play_id);
    }
    document.getElementsByTagName('html')[0].scrollTop = 0
  }
  
  render(){
    return(
      <div className={style.playerPageSection}>
        <div className={style.videoWrapper}>
          <div className={style.videoRow}>
            <div className={style.videoLeft}>
              {
                this.state.currentEpisode.hasOwnProperty("play_id") ? 
                  <AnimeVideoPlayer video={this.state.currentEpisode} />
                :
                  "Loading..."
              }
            </div>
            <div className={style.videoRight}>
              {
                this.state.allPlayList.length > 0 ? 
                  <AnimePlayList changeVideo={(data) => this.handleChangeVideo(data)} playlist={this.state} />
                :
                "Loading..."
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlayerPage;