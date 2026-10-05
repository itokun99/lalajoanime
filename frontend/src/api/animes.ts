import { DirectusError, directusGet } from "./client";
import type {
  Anime,
  AnimeDownload,
  AnimeStream,
  DirectusItem,
  DirectusList,
} from "./types";

export interface ListAnimesOptions {
  search?: string;
  genre?: string;
  sort?: string;
  limit?: number;
  page?: number;
}

// Directus stores genres as a comma-separated text field (so that
// filter[genres][_contains] works); the app contract is string[].
function normalizeGenres(genres: unknown): Anime["genres"] {
  if (typeof genres === "string") {
    const parts = genres
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : null;
  }
  if (Array.isArray(genres)) return genres as string[];
  return null;
}

function normalizeAnime(row: Anime): Anime {
  return { ...row, genres: normalizeGenres(row.genres) };
}

export async function listAnimes(opts?: ListAnimesOptions): Promise<Anime[]> {
  const res = await directusGet<DirectusList<Anime>>("/items/animes", {
    "filter[published][_eq]": true,
    "filter[genres][_contains]": opts?.genre || undefined,
    search: opts?.search || undefined,
    sort: opts?.sort ?? "-date_updated",
    limit: opts?.limit ?? 12,
    page: opts?.page ?? 1,
  });
  return res.data.map(normalizeAnime);
}

export async function getAnimeByMalId(
  malId: number | string,
): Promise<Anime | null> {
  const res = await directusGet<DirectusList<Anime>>("/items/animes", {
    "filter[mal_id][_eq]": malId,
    "filter[published][_eq]": true,
    limit: 1,
  });
  const row = res.data[0] ?? null;
  return row ? normalizeAnime(row) : null;
}

export async function listStreams(
  animeId: number | string,
): Promise<AnimeStream[]> {
  const res = await directusGet<DirectusList<AnimeStream>>(
    "/items/anime_streams",
    {
      "filter[anime][_eq]": animeId,
      "filter[published][_eq]": true,
      sort: "episode_number,quality",
    },
  );
  return res.data;
}

export async function listDownloads(
  animeId: number | string,
): Promise<AnimeDownload[]> {
  const res = await directusGet<DirectusList<AnimeDownload>>(
    "/items/anime_downloads",
    {
      "filter[anime][_eq]": animeId,
      "filter[published][_eq]": true,
      sort: "quality,server_name",
    },
  );
  return res.data;
}

export type StreamWithAnime = Omit<AnimeStream, "anime"> & { anime: Anime };

export async function getStream(
  streamId: number | string,
): Promise<StreamWithAnime | null> {
  try {
    const res = await directusGet<DirectusItem<StreamWithAnime>>(
      `/items/anime_streams/${streamId}`,
      { fields: "*,anime.*" },
    );
    if (!res.data) return null;
    const related: unknown = res.data.anime;
    if (typeof related === "number") {
      // Live API does not expand the anime relation; fetch it directly.
      const one = await directusGet<DirectusItem<Anime>>(
        `/items/animes/${related}`,
      );
      return { ...res.data, anime: normalizeAnime(one.data) };
    }
    return {
      ...res.data,
      anime: res.data.anime ? normalizeAnime(res.data.anime) : res.data.anime,
    };
  } catch (err) {
    if (
      err instanceof DirectusError &&
      (err.status === 404 || err.status === 403)
    ) {
      return null;
    }
    throw err;
  }
}
