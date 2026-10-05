# LalajoAnime frontend

Vite 8 + React 19 + TypeScript app with Tailwind CSS v4 and shadcn/ui,
styled in a dark-only neoterminal theme. It queries Directus directly.
There's no app backend in between.

See the repo root README for the full quickstart (Directus first, then this
app) plus routes, data model, and migration notes.

## Scripts

Run these from `frontend/`:

| Command | What it does |
| --- | --- |
| `bun install` | installs dependencies (bun-managed, no yarn) |
| `bun run dev` | starts Vite at http://localhost:5173 |
| `bun run build` | typechecks (`tsc -b`) then builds for production |
| `bun run preview` | serves the production build locally |
| `bun run lint` | runs oxlint over the project |

## Env vars

| Var | Default | Notes |
| --- | --- | --- |
| `VITE_DIRECTUS_URL` | `/directus` | Base URL the app uses for Directus reads. Copy `frontend/.env.example` to `.env` to override it. |

Set it to your Directus origin (for example `http://localhost:8055`) when the
app isn't served through the Vite dev proxy.

## Dev proxy

`vite.config.ts` proxies `/directus` to `http://localhost:8055` and strips the
prefix, so the default `VITE_DIRECTUS_URL=/directus` just works during local
dev. It avoids CORS headaches without any extra setup. Production builds don't
get this proxy. Point `VITE_DIRECTUS_URL` at the real Directus server (and
allow the site origin in Directus CORS) when you deploy.

## Project structure

```
src/
  api/            # client.ts (Directus fetch client), types.ts,
                  # animes.ts (collection queries), queries.ts (react-query
                  # hooks), provider.tsx (query client provider)
  components/
    ui/           # shadcn primitives, restyled for the neoterminal look
                  # (button, card, input, badge, skeleton, tabs, table, ...)
    layout/       # app-shell.tsx, header.tsx, footer.tsx
    anime/        # anime-card, anime-grid, episode-list, stream-player,
                  # download-table, quality-badge, meta-list, section-heading
  pages/          # home.tsx (/), anime-list.tsx (/anime-list),
                  # anime-detail.tsx (/anime/:malId/:slug),
                  # watch.tsx (/watch/:streamId), not-found.tsx
  lib/            # utils.ts (cn from clsx + tailwind-merge),
                  # format.ts, slug.ts
  router.tsx      # route table
  main.tsx        # entry point, providers + router
  index.css       # Tailwind v4 + theme tokens
```

`@` maps to `src/` (see `vite.config.ts`). Directus is the CMS behind this
app: collections and seed scripts live in `directus/`, and the admin panel
runs at http://localhost:8055/admin during local dev.
