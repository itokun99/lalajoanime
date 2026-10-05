import React, {useState, useEffect} from 'react';
import style from './AnimeStack.module.css';
import AnimeCard from '../AnimeCard/AnimeCard';


const AnimeStack  = (props) => {
  const animeData = props.animeData;
  const [anime_data, onSearch] = useState(props.animeData);
  const [inputText, onInput] = useState("");
  
  const handleContent = (text) => {
    if(text !== ""){
      let resultAnime = [];
      let animes = [...animeData];
      animes.forEach((anime) => {
        let searchResult = anime.anime_title.toLowerCase().indexOf(text.toLowerCase());
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
      onSearch(resultAnime);
    } else {
      onSearch(animeData);
    }
  }
  useEffect(() => {
    handleContent(inputText)
  })
  return(
    <div className={style.stackWrapper}>
      <div className={style.stackHeader}>
        <h4 className={style.stackTitle}>{props.title}</h4>
        <div className={style.stackSearch}>
          <input onChange = {(e) => onInput(e.target.value)} type="text" defaultValue="" placeholder="search.." />
        </div>
      </div>
      <div className={style.stackBody}>
        <div className={style.animeCardRow}>
          {
            anime_data.length > 0 ?
            anime_data.map((anime, index) => {
              return(
                <AnimeCard
                  linkToPlayer = {(anime_mal_id, anime_title, anime_play_id, anime_play_title, anime_data) => props.linkToPlayer(anime_mal_id, anime_title, anime_play_id,anime_play_title, anime_data)}
                  linkToPost={(mal_id, anime_title, anime) => props.linkToPost(mal_id, anime_title, anime)}
                  key={index}
                  animeData={anime}
                />
              )    
            })
            :
            <div style={{textAlign : "center", width : "100%"}}>
              <span>Tidak ada hasil dari: <b>{inputText}</b></span>
            </div>
          }
        </div>
      </div>
      <div className={style.stackFooter}>
        <div className={style.btnWrapper}>
          {
            props.isLoading ? 
              <button className={style.btnLoadMoreEmpty}>Please Wait...</button>
            :
              props.emptyList ?
                <button className={style.btnLoadMoreEmpty}>Loaded</button>
              :
                <button onClick={() => props.onLoadMore()} className={style.btnLoadMore}>Show More</button>
          }
        </div>
      </div>
    </div>
  );
}

export default AnimeStack;