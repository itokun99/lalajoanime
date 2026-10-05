# api — the single data-access layer

Earned its file (score 8.5, distinct domain): every Directus read in the app goes through here; components never call fetch.

## OVERVIEW
REST access to the Directus collections (`animes`, `anime_streams`, `anime_downloads`) through one fetch helper, plus react-query hooks and the app's row types.

## STRUCTURE
```
client.ts    # DIRECTUS_URL, DirectusError, directusGet — the only fetch path
types.ts     # Anime / AnimeStream / AnimeDownload / Quality / DirectusList / DirectusItem
animes.ts    # collection fetchers: listAnimes, getAnimeByMalId, listStreams, listDownloads, getStream
queries.ts   # use* wrappers: queryKey + staleTime 30s + enabled guards on id args
provider.tsx # QueryClientProvider (staleTime 30_000, retry 1), mounted in App.tsx
```

## CONVENTIONS
- Every read filters `filter[published][_eq]: true` and passes params as pre-built strings (`filter[anime][_eq]`, `sort`, `limit`, `page`); `directusGet` drops undefined values and URL-encodes the rest.
- `genres` arrives as the Directus comma-separated text; `normalizeGenres` converts it to `string[] | null` at this boundary — consumers get the normalized type.
- Errors surface as `DirectusError` (message + status); `getStream` maps 404/403 to `null` ("not found").
- The live Directus does not expand the m2o `anime` relation even with `fields=*,anime.*`; `getStream` detects a numeric `anime` and does a second fetch. Do not assume relation expansion anywhere else.
- New data need = a fetcher in animes.ts + a hook in queries.ts (queryKey `["animes", opts]`-style); pages consume hooks, never fetchers directly.

## ANTI-PATTERNS (THIS PROJECT)
- No component-side fetching or hardcoded Directus hosts; go through `directusGet` and `DIRECTUS_URL` (`VITE_DIRECTUS_URL`, default `/directus` via the Vite proxy).
- Do not change the collection shape from here — schema lives in `directus/seed/setup-schema.mjs`.

## NOTES
- Sort defaults: listAnimes `-date_updated`, listStreams `episode_number,quality`, listDownloads `quality,server_name`.
- `mal_id` is the public URL identifier; DB `id` stays internal — both are integers, never swap them in links.
- `Quality` union is fixed (`360p | 480p | 720p | 1080p`); unmatched values still arrive and render uppercased via `qualityLabel`.
- `StreamWithAnime` (stream + its anime) is declared in animes.ts, not types.ts.
