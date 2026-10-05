import React, {Component} from 'react';
import style from './Home.module.css';
import ContentWrapper from '../../template/ContentWrapper/ContentWrapper'
import AnimeStack from '../../../component/AnimeStack/AnimeStack';
import {GlobalConsumer} from '../../../context/Context';
import AnimeAPI from '../../../service/Service';
class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      animeData : [],
      emptyList : false,
      isLoading : false,
    }
  }

  handleAnimeData = () => {
    let animeData = [...this.state.animeData]
    setTimeout(() => {
       animeData = this.props.RootState.Anime;
       this.setState({
        animeData : animeData
       })
    }, 100 )
  }

  handleLoadMore = () => {
    let copyState = [...this.state.animeData];
    let newState = [];
    let offsetLength = copyState.length;
    let params = {
      order_by : "date_update",
      listed : "asc",
      limit_offset : offsetLength,
      limit : 10, 
    }
    this.setState({
      isLoading : true
    }, () => {
      AnimeAPI.getAnime(params).then((response) => {
        if(response.status === true){
          newState = response.data;
          newState.reverse();
          this.setState({
            animeData : [...copyState, ...newState],
            isLoading : false
          }, () => {
            console.log(this.state.animeData);
          });
        } else {
          console.log(response)
          if(response.statusCode === 404){
            this.setState({
              emptyList : true,
              isLoading : false,
            })
          }
        }
      })
    })
    
  }
  
  handleLinkToPost = (anime_mal_id, anime_title, anime_data) => {
     this.props.history.push(`/anime/${anime_mal_id}/${anime_title}`, anime_data);
  }
  
  handleLinkToPlayer = (anime_mal_id, anime_title,anime_play_id, anime_play_title, anime_data) => {
    this.props.history.push(`/anime/${anime_mal_id}/${anime_title}/${anime_play_id}/${anime_play_title}`, anime_data);
  }
  
  
  componentDidMount(){
    this.handleAnimeData();
    document.title = "Weebonime - Nonton dan Download Anime Sepuasnya";
    document.getElementsByTagName('html')[0].scrollTop = 0
  }
  
  componentWillReceiveProps(){
    this.handleAnimeData();
  }

  render(){
    return(
      <div className={style.homeComponent}>
        <AnimeStack
          title="Latest Update"
          animeData = {this.state.animeData}
          linkToPlayer = {(anime_mal_id, anime_title, anime_play_id,anime_play_title, anime_data) => this.handleLinkToPlayer(anime_mal_id, anime_title, anime_play_id, anime_play_title, anime_data)}
          linkToPost = {(mal_id, anime_title, anime) => this.handleLinkToPost(mal_id, anime_title, anime)}
          onLoadMore = {this.handleLoadMore}
          emptyList = {this.state.emptyList}
          isLoading = {this.state.isLoading}
        />
        {/* <AnimeStack
          title="Popular Anime"
          animeData = {this.state.animeData}
          linkToPost = {(mal_id, anime_title, anime) => this.handleLinkToPost(mal_id, anime_title, anime)} 
        /> */}
      </div>
    );
  }
}
export default GlobalConsumer(ContentWrapper(Home));