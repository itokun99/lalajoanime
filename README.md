# LalajoAnime

Anime streaming and download site, rebuilt on a headless CMS stack. The web app
reads straight from Directus. There's no custom API server anymore.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Vite 8 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui |
| Theme | Neoterminal, dark only |
| Backend / CMS | Directus 11 (docker compose: Directus + Postgres 16) |
| Data fetching | @tanstack/react-query 5 + Directus REST API |
| Player | react-player 3 |
| Package manager | bun (frontend is bun-managed, no yarn) |

## Architecture

```
lalajoanime/
  frontend/            # Vite + React app, the live site
    src/
      api/             # Directus client, types, queries
      components/
        ui/            # restyled shadcn primitives
        layout/        # app shell, header, footer
        anime/         # cards, grids, player, episode/download lists
      pages/           # home, anime-list, anime-detail, watch, not-found
      router.tsx       # route table
  directus/            # headless CMS
    docker-compose.yml # postgres 16 + directus 11
    .env.example       # copy to .env before first boot
    schema/
      snapshot.json    # schema snapshot, JSON, re-appliable
    seed/
      setup-schema.mjs # schema-as-code, creates collections/relations/policy
      import-sql.mjs   # one-off import from the legacy MySQL dump
      seed.mjs         # seed content from seed/data/
      data/            # animes.json, streams.json, downloads.json
  legacy/              # archived, read-only, not part of the running system
    frontend-cra/      # old Create React App client
    backend-codeigniter/ # old CodeIgniter app + weebonime_master.sql
  .omo/evidence/       # verification logs from the rebuild
```

The frontend talks to the Directus API directly. Content and data live in
Directus collections, not in app code.

## Quickstart

You'll bring up Directus first, then the frontend.

### 1. Directus

```sh
cp directus/.env.example directus/.env
cd directus
docker compose --env-file .env up -d
```

Wait until Directus answers health:

```sh
curl -s http://localhost:8055/server/health
```

Then create the schema and seed the content (from the repo root):

```sh
node directus/seed/setup-schema.mjs
node directus/seed/seed.mjs
```

Both scripts read `DIRECTUS_URL` (default `http://localhost:8055`),
`DIRECTUS_ADMIN_EMAIL`, and `DIRECTUS_ADMIN_PASSWORD` from the environment.
They default to the same admin account as `.env.example`.

To re-apply the checked-in schema snapshot instead:

```sh
docker compose exec -T directus npx directus schema apply --dry-run /directus/schema/snapshot.json
```

Drop `--dry-run` once you're happy with the diff. The snapshot lives at
`directus/schema/snapshot.json`.

Admin panel: http://localhost:8055/admin. Default login is
`admin@example.com` / `admin1234` (from `.env.example`, CHANGE-ME for anything
real).

### 2. Frontend

```sh
cd frontend
bun install
bun run dev
```

The site runs at http://localhost:5173. It reads `VITE_DIRECTUS_URL`
(default `/directus`, see below).

## Routes

| Route | Page | What it shows |
| --- | --- | --- |
| `/` | home | featured anime, latest episodes, lists |
| `/anime-list` | anime-list | search plus genre filter, sort, and pagination |
| `/anime/:malId/:slug` | anime-detail | metadata, synopsis, trailer, episodes, downloads |
| `/watch/:streamId` | watch | player with quality switch, episode list, downloads |

Anything else renders the `not-found` page.

## Data model

Three Directus collections:

- `animes` — one row per title: MAL id, titles, slug, synopsis, genres, score,
  poster/cover/trailer, status, dates, episode count.
- `anime_streams` — watchable sources. Each row points at one anime
  (many-to-one `anime`) and carries episode number, label, quality options,
  and embed/file URLs.
- `anime_downloads` — download links. Same shape: many-to-one `anime`,
  episode number, quality label, provider, URL.

Public read policy: anonymous visitors can read published rows. Writes go
through the admin account or an editor role in the Directus admin.

## Migration notes

The old stack was CodeIgniter REST on MySQL plus a Create React App client.
That backend is gone. Directus now serves the content API, Postgres holds the
data, and the new Vite frontend queries Directus directly.

Dropped on purpose:

- The MAL scraper (AnimeGrab). Ingestion happens through the seed pipeline
  and the Directus admin, not a scraper service.
- The old PHP admin panel. The Directus admin replaces it.
- Manga endpoints. The web UI never used them.
- The visit counter. It wasn't kept in the new model.

`legacy/` keeps the old trees untouched so the migration stays traceable.
Don't build on them.

## Verification and evidence

Rebuild logs live under `.omo/evidence/` (foundation checks, Directus
end-to-end run, page verification). If you change the schema, refresh
`directus/schema/snapshot.json` and note the run in a new evidence folder so
the next person can retrace your steps.
