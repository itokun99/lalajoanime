import React, {Component, Fragment} from 'react';
import style from './AnimeList.module.css';
import AnimeAPI from '../../../service/Service';
import AnimeCard from '../../../component/AnimeCard/AnimeCard';

const SearchField = (props) => {
  return(
    <div className={style.searchSection}>
      <h4>Cari Anime</h4>
      <input onChange={(e) => props.onSearch(e.target.value)} type="text" placeholder="Anime, Genre, Rating, dll.." name="search_input" />
    </div>
  );
}

class AnimeList extends Component {
  constructor(props){
    super(props)
    this.state = {
      animes : [],
      animesOnSearch : [],
      onSearch : false,
      inputText : "",
      simpleMode : false,
    }
  }
  
  handleGetAnimes = () => {
    let params = {
      order_by : "anime_title"
    }
    AnimeAPI.getAnime(params).then((response) => {
      if(response.status === true){
        let animes = response.data
        let prevState = [...this.state.animes];
        prevState = animes.sort()
        this.setState({
          animes : prevState
        })
      } else {
        console.log(response);
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }
  
  handleLinkToPost = (anime_mal_id, anime_title, anime_data) => {
    this.props.history.push(`/anime/${anime_mal_id}/${anime_title}`, anime_data);
  }
  handleLinkToPlayer = (anime_mal_id, anime_title,anime_play_id, anime_play_title, anime_data) => {
    this.props.history.push(`/anime/${anime_mal_id}/${anime_title}/${anime_play_id}/${anime_play_title}`, anime_data);
  }
  
  handleSearch = (inputText) => {
    if(inputText !== ""){
      let resultAnime = [];
      let animes = [...this.state.animes];
      animes.forEach((anime) => {
        let searchResult = anime.anime_title.toLowerCase().indexOf(inputText.toLowerCase());
        let searchResultByGenre = anime.anime_genre.toLowerCase().indexOf(inputText.toLowerCase());
        let searchResultByScore = anime.anime_score.toLowerCase().indexOf(inputText.toLowerCase());
        let searchResultByRilis = anime.anime_release.toLowerCase().indexOf(inputText.toLowerCase());
        let searchResultByStudio = anime.anime_studios.toLowerCase().indexOf(inputText.toLowerCase());
        let searchResultBySinopsis = anime.anime_sinopsis.toLowerCase().indexOf(inputText.toLowerCase());
        let ongoing = "ongoing";
        let completed = "completed";
        let searchResultByOngoing = ongoing.indexOf(inputText.toLowerCase());
        let searchResultByCompleted = completed.indexOf(inputText.toLowerCase());
        let searchResultByStatus = anime.anime_status.toLowerCase().indexOf(inputText.toLowerCase());
        
        if(searchResult !== -1 && searchResult !== "undefined"){
          resultAnime.push(anime)
        }else if(searchResultByGenre !== -1 && searchResultByGenre !== "undefined"){
          resultAnime.push(anime)          
        }else if(searchResultByScore !== -1 && searchResultByScore !== "undefined"){
          resultAnime.push(anime)          
        }else if(searchResultByRilis !== -1 && searchResultByRilis !== "undefined"){
          resultAnime.push(anime)          
        }else if(searchResultByStudio !== -1 && searchResultByStudio !== "undefined"){
          resultAnime.push(anime)          
        }else if(searchResultBySinopsis !== -1 && searchResultBySinopsis !== "undefined"){
          resultAnime.push(anime)          
        }else if(searchResultByOngoing !== -1 && searchResultByOngoing !== "undefined"){
          if(anime.anime_status.toLowerCase() === "currently airing"){
            resultAnime.push(anime)
          }
        }else if(searchResultByCompleted !== -1 && searchResultByCompleted !== "undefined"){
          if(anime.anime_status.toLowerCase() === "finished airing"){
            resultAnime.push(anime)
          }
        }else if(searchResultByStatus !== -1 && searchResultByStatus !== "undefined"){
          resultAnime.push(anime)          
        }
      })
      this.setState({
        animesOnSearch : resultAnime,
        onSearch : true,
        inputText : inputText
      })
    } else {
      this.setState({
        animesOnSearch : [],
        onSearch : false,
        inputText : inputText
      })
    }
  }
  
  handleMode = () => {
    this.setState({
      simpleMode : !this.state.simpleMode
    })
  }
  
  componentDidMount(){
    this.handleGetAnimes();
    document.title = "Anime List - Cari Daftar Anime Favorit"
    document.getElementsByTagName('html')[0].scrollTop = 0
  }
  
  render(){
    let alphabeta = [];
    
    this.state.animes.map((anime, index) => {
      if(alphabeta.length === 0){
        alphabeta.push(anime.anime_title[0].toUpperCase())
        return alphabeta;
      }
      let hasSameAlphaBeta = false;
      alphabeta.find((value) => {
        if(anime.anime_title[0].toUpperCase() === value){
          hasSameAlphaBeta = true;
          return true;
        } else {
          return false;
        }
      })
      if(!hasSameAlphaBeta){
        alphabeta.push(anime.anime_title[0].toUpperCase());
      }
      return hasSameAlphaBeta;
    })
    return(
      <div className={style.animeListSection}>
        <div className={style.animeListHeader}>
          <SearchField onSearch={(inputText) => this.handleSearch(inputText)} />
        </div>
        <div className={style.animeListBody}>
          <div className={style.mode}>
            <div onClick={this.handleMode} className={style.btnWrapper}>
              {this.state.simpleMode ? 
                <>
                  <button >Card</button>
                  <button className={style.active}>Simple</button>
                </>
                :
                <>
                  <button className={style.active}>Card</button>
                  <button>Simple</button>
                </> 
                }
            </div>
          </div>
          <div className={style.animeListBlock}>
            {
              this.state.onSearch?
                this.state.animesOnSearch.length > 0 ?
                  <div className={style.animeListRow}>
                  {
                    this.state.animesOnSearch.map((anime) => {
                      if(this.state.simpleMode){
                        return(
                          <li key={anime.anime_mal_id} onClick={() => this.handleLinkToPost(anime.anime_mal_id, anime.anime_title, anime)}>{anime.anime_title}</li>
                        )
                      } else {
                        return(
                          <AnimeCard
                            key={anime.anime_mal_id}
                            animeData = {anime}
                            linkToPlayer = {(anime_mal_id, anime_title,anime_play_id, anime_play_title, anime_data) => this.handleLinkToPlayer(anime_mal_id, anime_title,anime_play_id, anime_play_title, anime_data)}
                            linkToPost={(mal_id, anime_title, anime) => this.handleLinkToPost(mal_id, anime_title, anime)} />
                        );    
                      }
                    })  
                  }
                  </div>
                :
                <div className={style.animeListRow}>
                  <p style={{textAlign : "center", width : "100%"}}>Tidak ada pencarian dengan kata kunci : {this.state.inputText}</p>
                </div>
              : 
              alphabeta.map((alpha, index) => {
                let has = false;
                this.state.animes.forEach((anime) => {
                  if(anime.anime_title[0].toUpperCase() === alpha){
                    has = true
                  }
                })
                if(has){
                  return(
                    <Fragment key={index}>
                      <h4 id={alpha}><a href={`#${alpha}`}>{alpha}</a></h4>
                      <div className={style.animeListRow}>
                        {
                          this.state.animes.map((anime, index) => {
                            if(anime.anime_title[0].toUpperCase() === alpha){
                              if(this.state.simpleMode){
                                 return(
                                   <li key={anime.anime_mal_id} onClick={() => this.handleLinkToPost(anime.anime_mal_id, anime.anime_title, anime)}>{anime.anime_title}</li>
                                 )
                              } else {
                                return(
                                  <AnimeCard
                                    key={anime.anime_mal_id}
                                    animeData = {anime}
                                    linkToPlayer = {(anime_mal_id, anime_title,anime_play_id, anime_play_title, anime_data) => this.handleLinkToPlayer(anime_mal_id, anime_title,anime_play_id, anime_play_title, anime_data)}
                                    linkToPost={(mal_id, anime_title, anime) => this.handleLinkToPost(mal_id, anime_title, anime)} />
                                )
                              }
                            } else {
                              return "";
                            }
                          })
                        }
                      </div>
                    </Fragment>
                  )
                } else {
                  return false;
                }
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default AnimeList;