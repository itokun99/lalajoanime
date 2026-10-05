# frontend — Vite 8 + React 19 app

Earned its file (score 15, distinct domain): the whole live site. Its per-area contracts, dead code, and theme rules are invisible from source names alone.

## OVERVIEW
TypeScript SPA on Tailwind 4 + restyled shadcn (radix-nova) primitives; reads Directus REST through src/api; bun-managed; dev server on :5173.

## STRUCTURE
```
src/
├── api/        # the only data path — read api/AGENTS.md before touching data
├── components/
│   ├── anime/  # barrel index.ts (8 widgets); consumed ONLY by pages/watch.tsx
│   ├── layout/ # AppShell (header, footer, pathname status bar) + header + footer
│   └── ui/     # 11 restyled primitives incl. custom prompt.tsx; no barrel, import files directly
├── lib/        # cn(), slugify(), formatDate()/qualityLabel()
├── pages/      # route components; Indonesian UI copy with terminal motifs
├── router.tsx  # declarative Routes; no loaders/error boundaries/lazy
└── main.tsx    # createRoot + index.css import (StrictMode)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Entry chain | index.html -> main.tsx -> App.tsx | BrowserRouter > ApiProvider > AppShell > AppRoutes |
| Route table | router.tsx | `/`, `/anime-list`, `/anime/:malId/:slug`, `/watch/:streamId`, `*` -> not-found |
| Theme tokens + utilities | src/index.css | palette vars; `scanlines`, `glow-box`, `glow-text`, `dashed-divider`, `animate-caret/flicker` |
| Dev proxy / alias | vite.config.ts | `@` -> src; `/directus` -> http://localhost:8055 with prefix rewrite |
| Visible card/grid UI | pages/home.tsx, pages/anime-list.tsx | each page defines its own AnimeCard/AnimeGrid inline |
| Quality switch + episodes | pages/watch.tsx | the only consumer of `@/components/anime` |

## CONVENTIONS (differs from parent)
- `verbatimModuleSyntax` + `noUnusedLocals/Parameters`: `import type` is mandatory for type-only imports. TS `strict` is NOT enabled — keep the existing null-guard discipline (`!= null` checks) instead of assuming strict-null guarantees; oxlint is the only linter, no formatter is configured.
- Styling is token-only: `rounded-none` on every primitive, `font-mono`, `border-border`/`bg-card`, labels `uppercase tracking-[0.08em]`, glows via rgba(0,255,136,…) shadows or the glow utilities.
- Page state pattern: react-query hook -> skeleton loading -> `$ error: …` alert line -> `[ BELUM ADA … ]` empty state; copy is Indonesian.
- UI primitives come from the unified `radix-ui` package, never `@radix-ui/react-*`.
- anime-list search debounces at 300ms; page sizes: home 12, list 24.
- The `/directus` proxy is dev-only (frontend/README.md:35): production builds need a real `VITE_DIRECTUS_URL` or a same-origin mount.

## ANTI-PATTERNS (THIS PROJECT)
- Edit where the UI renders: pages re-implement AnimeCard/AnimeGrid/MetaList/SectionHeading locally; the `components/anime` versions of AnimeCard, AnimeGrid, MetaList are dead (barrel-only) — fixing them changes nothing on screen.
- Unused ui primitives: `tabs.tsx`, `progress.tsx`, `scroll-area.tsx` have zero usages.
- Dead artifacts to leave alone: src/App.css, src/assets/*, public/icons.svg (never imported), deps `cn` and `@fontsource-variable/geist` (unused; no webfont import on purpose).
- No test runner exists — `bun run build` (tsc -b + vite build) and `bun run lint` (oxlint) are the only gates; verify behavior manually via `bun run dev`.
- Never bypass `@/api` with raw fetch or hardcode the Directus host (see api/AGENTS.md).
