# PROJECT KNOWLEDGE BASE

**Generated:** 2026-10-05
**Commit:** 5169ccf
**Branch:** main

## OVERVIEW
Anime streaming & download site on a headless-CMS stack: Vite 8 + React 19 + TypeScript + Tailwind 4 + shadcn (frontend/) reads Directus 11 + PostgreSQL 16 (directus/) directly. There is no custom API server — content lives in Directus collections.

## STRUCTURE
```
lalajoanime/
├── frontend/   # Vite React app (bun-managed; no root package.json) — see frontend/AGENTS.md
├── directus/   # CMS: compose stack, schema-as-code, seed pipeline — see directus/AGENTS.md
├── README.md   # authoritative setup, routes, and data-model notes
└── .omo/evidence/  # tracked verification logs from the rebuild (5 runs)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add / change a page | frontend/src/pages/, frontend/src/router.tsx | routes: `/`, `/anime-list`, `/anime/:malId/:slug`, `/watch/:streamId` |
| Fetch or shape data | frontend/src/api/ | the only fetch path; see its AGENTS.md |
| Change the content model | directus/seed/setup-schema.mjs + directus/schema/snapshot.json | keep both in sync |
| Boot / seed content | directus/README.md, directus/seed/ | health-gate then seed; see directus/AGENTS.md |
| Theme + tokens | frontend/src/index.css | neoterminal palette, utilities |
| Old stack | git history only (`da8c0cf`) | CodeIgniter + CRA trees dropped in `5169ccf` |

## CODE MAP
Measured with LSP references.

| Symbol | Type | Location | Refs | Role |
|--------|------|----------|------|------|
| `cn` | fn | frontend/src/lib/utils.ts:4 | ~48 | class merge used by every styled component |
| `slugify` | fn | frontend/src/lib/slug.ts:1 | ~11 | builds the `/anime/:malId/:slug` URL |
| `directusGet` | fn | frontend/src/api/client.ts:18 | ~8 | the only Directus fetch helper |
| `formatDate` | fn | frontend/src/lib/format.ts:15 | ~7 | `id-ID` date output |
| `useAnimeList` / `useAnime` / `useStreams` / `useStream` / `useDownloads` | hooks | frontend/src/api/queries.ts | 3–5 each | react-query wrappers (staleTime 30s) |
| `queryClient` | object | frontend/src/api/provider.tsx:4 | — | module-level client; staleTime 30s, retry 1 |

## CONVENTIONS
- Two languages, on purpose: UI copy is Indonesian (`<html lang="id">`, `[ BELUM ADA … ]`); code, comments, and docs are English.
- Neoterminal design language is binding: dark-only, mono-only, sharp corners, `[ BRACKET ]` labels, terminal motifs. Do not ship stock shadcn styling; restyle primitives in place.
- Package manager is bun (frontend/bun.lock); all scripts run inside frontend/ — there is no root package.json.
- Reads filter `published = true`; writes go through the Directus admin or `directus/seed/` scripts.
- `genres` is a comma-separated TEXT column in Directus (so `filter[_contains]` works) and is normalized to `string[]` in the api layer.
- Schema-as-code: collection changes belong in `setup-schema.mjs`; after a schema change refresh `schema/snapshot.json` and add a `.omo/evidence/` run note (README's rule).

## ANTI-PATTERNS (THIS PROJECT)
- No custom API server, no scraper, no PHP admin, no manga endpoints, no visit counter — deliberately dropped in the rebuild (README "Dropped on purpose"). Do not resurrect them.
- Never call Directus from components; everything goes through `frontend/src/api/`.
- Never commit `.env` (gitignored); default credentials `admin@example.com` / `admin1234` and `dev-secret-change-me` are dev-only — change before any real deploy.
- `.omo/evidence/` is tracked history; append new folders, do not rewrite or delete old logs.

## UNIQUE STYLES
- Terminal language throughout: `$` prompt prefix, blinking `▮` caret, `[ … ]` badges, dashed dividers, scanlines overlay, glow shadows, status bar (`NORMAL | UTF-8 | LF | <pathname>`).
- States rendered as terminal lines: `$ error: …`, `[ BELUM ADA ANIME ]`, `$ total: N judul`, `$ cd /` back-links.

## COMMANDS
```bash
# CMS first (repo root). Requires Docker; wait for {"status":"ok"} before seeding.
cp directus/.env.example directus/.env
cd directus && docker compose --env-file .env up -d
curl -s http://localhost:8055/server/health
node directus/seed/setup-schema.mjs && node directus/seed/seed.mjs   # idempotent

# Web app (separate shell)
cd frontend
bun install && bun run dev   # :5173, proxies /directus -> :8055
bun run build                # tsc -b && vite build
bun run lint                 # oxlint
```

## NOTES
- Frontend has no test runner; build + lint + manual browser check are the gates (details in frontend/AGENTS.md).
- The legacy tree is gone from the working tree (commit `5169ccf`); recover anything from git history, not the filesystem.
- `directus/seed/import-sql.mjs` legacy fallback path no longer exists; the live dump is `directus/seed/data/weebonime_master.sql`.
- `<title>`s drift by design: pages overwrite `document.title`, index.html keeps its own; don't "fix" one to match the other without checking all pages.
