import React from 'react';
import styles from './AnimePlayList.module.css';
import {Icon} from 'react-icons-kit';
import {ic_play_arrow} from 'react-icons-kit/md/ic_play_arrow'


const AnimePlayList = (props) => { 
  return(
    <div className={styles.section}>
      <div className={styles.header}>
        <h4 className={styles.headerTitle}>{props.playlist.anime.anime_title}</h4>
        <span className={styles.headerInfo}>Jumlah Episode: {props.playlist.anime.anime_episode}</span>
        <span className={styles.headerStatus}>{props.playlist.anime.anime_status}</span>
      </div>
      <div className={styles.body}>
        <ul>
          {
            typeof(props.playlist.allPlayList) !== "undefined" && props.playlist.allPlayList.length > 0 ?
            props.playlist.allPlayList.map((list) => {
              
              return(
                <li className={list.play_id === props.playlist.currentEpisode.play_id ? styles.active : "" } onClick={() => props.changeVideo(list)} key={list.play_id}>
                  <div className={styles.listItem}>
                    <div className={styles.listThumbWrapper}>
                      <div className={styles.thumb} style={{backgroundImage : `url(${list.anime_thumb})`}}>
                        
                      </div>
                    </div>
                    <div className={styles.listText}>
                      <span className={styles.epsTitle}>{list.anime_play_title}</span>
                      <span className={styles.played}>
                        <Icon size={32} icon={ic_play_arrow} />
                      </span>
                    </div>
                  </div>
                </li>
              )
            })
            :
            "Loading..."
          }
        </ul>
      </div>
      <div className={styles.footer}>
        
      </div>
    </div>
  )
}

export default AnimePlayList;
