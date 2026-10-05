import { useQuery } from "@tanstack/react-query";
import {
  getAnimeByMalId,
  getStream,
  listAnimes,
  listDownloads,
  listStreams,
} from "./animes";
import type { ListAnimesOptions } from "./animes";

export function useAnimeList(opts?: ListAnimesOptions) {
  return useQuery({
    queryKey: ["animes", opts],
    queryFn: () => listAnimes(opts),
    staleTime: 30_000,
  });
}

export function useAnime(malId?: number | string | null) {
  return useQuery({
    queryKey: ["anime", malId],
    queryFn: () => getAnimeByMalId(malId ?? ""),
    enabled: malId !== undefined && malId !== null && malId !== "",
    staleTime: 30_000,
  });
}

export function useStreams(animeId?: number | string | null) {
  return useQuery({
    queryKey: ["streams", animeId],
    queryFn: () => listStreams(animeId ?? ""),
    enabled: animeId !== undefined && animeId !== null && animeId !== "",
    staleTime: 30_000,
  });
}

export function useDownloads(animeId?: number | string | null) {
  return useQuery({
    queryKey: ["downloads", animeId],
    queryFn: () => listDownloads(animeId ?? ""),
    enabled: animeId !== undefined && animeId !== null && animeId !== "",
    staleTime: 30_000,
  });
}

export function useStream(streamId?: number | string | null) {
  return useQuery({
    queryKey: ["stream", streamId],
    queryFn: () => getStream(streamId ?? ""),
    enabled: streamId !== undefined && streamId !== null && streamId !== "",
    staleTime: 30_000,
  });
}
