import React from 'react';
import style from './AnimeCard.module.css';
import { Icon } from 'react-icons-kit';
import {ic_star} from 'react-icons-kit/md/ic_star';

const AnimeCard = (props) => {
  let lastEpisode = props.animeData.anime_play_data.play360;
  let lastEpsText = "No Episode";
  if(lastEpisode.length > 0){
    lastEpsText = lastEpisode[0].anime_play_title;
  }
  let title = props.animeData.anime_title.split(" ").join("-").toLocaleLowerCase().replace("!", "").replace("?", "").replace(":", "");
  let state = {
    anime : props.animeData,
    currentPlay : lastEpisode[0],
    anotherList : lastEpisode,
  }
  
  
  return(
    <div data-id={props.animeData.anime_id} data-mal-id={props.animeData.anime_mal_id} className={style.animeCard}>
      <div className={style.animeCardItem}>
        <span className={style.rating}>
          <Icon icon={ic_star} style={{color : '#eccc68', lineHeight : '10px'}} />
          {props.animeData.anime_score}
        </span>
        <div onClick={() => props.linkToPost(props.animeData.anime_mal_id, title, props.animeData)} className={style.animeCardImage}>
          <img src={props.animeData.anime_poster} alt={props.animeData.anime_title} />
        </div>
        <div className={style.animeCardBody}>
          <h2 onClick={() => props.linkToPost(props.animeData.anime_mal_id, title, props.animeData)} className={style.animeCardTitle}>{props.animeData.anime_title}</h2>
          <span onClick={lastEpisode.length > 0 ? () => props.linkToPlayer(props.animeData.anime_mal_id, title, lastEpisode[0].play_id, lastEpisode[0].anime_play_title.split(" ").join("-").toLocaleLowerCase(), state ) : null} className={style.animeCardLastUp}>{lastEpisode.length > 0 ? lastEpsText : lastEpsText}</span>
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;