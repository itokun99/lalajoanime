export type Quality = "360p" | "480p" | "720p" | "1080p";

export interface Anime {
  id: number;
  mal_id: number;
  title: string;
  alternative_title: string | null;
  type: string | null;
  status: string | null;
  score: number | null;
  studios: string | null;
  duration: string | null;
  total_episodes: number | null;
  genres: string[] | null;
  release_date: string | null;
  trailer_url: string | null;
  synopsis: string | null;
  poster_url: string | null;
  published: boolean;
  date_created: string;
  date_updated: string;
}

export interface AnimeStream {
  id: number;
  anime: number;
  episode_number: number | null;
  episode_title: string;
  quality: Quality;
  link: string;
  thumbnail_url: string | null;
  published: boolean;
  date_created: string;
  date_updated: string;
}

export interface AnimeDownload {
  id: number;
  anime: number;
  server_name: string;
  link: string;
  size: string | null;
  quality: Quality;
  published: boolean;
  date_created: string;
  date_updated: string;
}

export interface DirectusList<T> {
  data: T[];
}

export interface DirectusItem<T> {
  data: T;
}
