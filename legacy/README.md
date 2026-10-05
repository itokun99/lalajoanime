# Legacy Archive

This directory holds the original LalajoAnime codebase, moved here intact when the
project was rebuilt on a new stack. **Nothing here runs in production anymore.**
It is kept as the reference of record for the migration.

| Folder | What it is | Status |
| --- | --- | --- |
| `backend-codeigniter/` | The legacy PHP backend: a CodeIgniter application that served the old REST API on top of a MySQL/MariaDB database (`weebonime_master`). | Retired, kept read-only |
| `frontend-cra/` | The legacy web client: a Create React App project (React 16, JavaScript) that consumed that REST API. | Retired, kept read-only |

## Current stack (outside this directory)

- `frontend/` — Vite + React + TypeScript + Tailwind + shadcn. This is the live
  user-facing app.
- `directus/` — Directus CMS. This is the live content backend that replaces the
  CodeIgniter REST API.

## Reference facts used by the migration

- `frontend-cra/src/router/` — the legacy route table (`Router.jsx`, `RootRouter.jsx`),
  which defines the page set the new app must still cover:
  `/`, `/anime-list/`, `/anime/:id/:title`, `/anime/:id/:title/:play_id/:play_title`.
- `frontend-cra/src/service/Service.jsx` — the legacy API layer. It is the inventory of
  every endpoint the old backend exposed (GET/POST/PUT/DELETE helpers plus its online
  and offline base paths), so it tells us which data operations the Directus collections
  have to cover.
- `backend-codeigniter/application/controllers/` — the legacy REST controllers
  (`Rest_server.php` and the `api/` group: `Animes.php`, `Manga.php`, `AnimeGrabber.php`,
  `User.php`, `Key.php`). They define the server-side behaviour, validation, and response
  shapes behind each endpoint above.
- `backend-codeigniter/weebonime_master.sql` — the legacy MySQL/MariaDB schema dump for
  `weebonime_master`. It is the source of truth for field names, types, and table
  relationships when modelling the new Directus collections.

## Rules for this directory

- Treat everything here as an archive: read it, grep it, copy logic out of it — do not
  modify or run it.
- New development belongs in `frontend/` and `directus/` at the repo root.