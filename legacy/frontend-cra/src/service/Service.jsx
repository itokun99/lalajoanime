// setting service
const config = {
  onlinePath: "http://192.168.100.3/weebonime/",
  // onlinePath : "http://weebonime.jalanpelajar.com/",
  offlinePath: "http://localhost:7000/",
  isOnline: false,
}

const Get = (path, status) => {
  let promise = new Promise((resolve, reject) => {
    let url = `${status ? config.onlinePath : config.offlinePath}${path}`
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }).then((response) => {
      if (response.ok) {
        resolve(response.json());
      } else {
        // console.log("ini", response)
        if (response.status === 404) {
          resolve(response.json());
        }
        // reject(new Error('error'))
      }
    }, (error) => {
      console.log(error);
      resolve(error.json())
      // reject(new Error(error))
    })
  });
  return promise;
}

const getAnime = (obj = null) => {
  if (obj !== null) {
    if (typeof (obj.id) === "undefined" || obj.id === "" || obj.id === null) {
      obj.id = null;
    }
    if (typeof (obj.mal_id) === "undefined" || obj.mal_id === "" || obj.mal_id === null) {
      obj.mal_id = null;
    }
    if (typeof (obj.order_by) === "undefined" || obj.order_by === "" || obj.order_by === null) {
      obj.order_by = null
    }
    if (typeof (obj.listed) === "undefined" || obj.listed === "" || obj.listed === null) {
      obj.listed = null
    }
    if (typeof (obj.genre) === "undefined" || obj.genre === "" || obj.genre === null) {
      obj.genre = null
    }
    if (typeof (obj.limit) === "undefined" || obj.limit === "" || obj.limit === null) {
      obj.limit = null
    }
    if (typeof (obj.limit_offset) === "undefined" || obj.limit_offset === "" || obj.limit_offset === null) {
      obj.limit_offset = null
    }
  }
  let path = `api/animes${obj === null ? "" : obj.id === null ? "" : "?anime_id=" + obj.id}${obj === null ? "" : obj.mal_id === null ? "" : obj.id === null ? "?anime_mal_id=" + obj.mal_id : "&anime_mal_id=" + obj.mal_id}${obj === null ? "" : obj.order_by === null ? "" : obj.id === null && obj.mal_id === null ? "?order_by=" + obj.order_by : "&order_by=" + obj.order_by}${obj === null ? "" : obj.listed === null ? "" : obj.id === null && obj.mal_id === null && obj.order_by === null ? "?listed=" + obj.listed : "&listed=" + obj.listed}${obj === null ? "" : obj.genre === null ? "" : obj.id === null && obj.mal_id === null && obj.order_by === null && obj.listed === null ? "?genre=" + obj.genre : "&genre=" + obj.genre}${obj === null ? "" : obj.limit === null ? "" : obj.id === null && obj.mal_id === null && obj.order_by === null && obj.listed === null && obj.genre === null ? "?limit=" + obj.limit : "&limit=" + obj.limit}${obj === null ? "" : obj.limit_offset === null ? "" : obj.id === null && obj.mal_id === null && obj.order_by === null && obj.listed === null && obj.genre === null && obj.limit ? "?limit_offset=" + obj.limit_offset : "&limit_offset=" + obj.limit_offset}`;

  return Get(path, config.isOnline);
}

const getAnimeFromMal = (id = null) => {
  let path = `api/grab-anime${id === null ? "" : "?id=" + id}`;
  return Get(path, config.isOnline);
}

const getAnimePlayList = (anime_mal_id, anime_play_quality) => {
  let path = `api/playlist?anime_mal_id=${anime_mal_id}&anime_play_quality=${anime_play_quality}`;
  return Get(path, config.isOnline);
}

const getAnimeCounter = () => {
  let path = 'api/counter2';
  return Get(path, config.isOnline);
}

const AnimeAPI = {
  getAnime,
  getAnimeFromMal,
  getAnimeCounter,
  getAnimePlayList,
}

export default AnimeAPI;