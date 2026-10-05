# directus — Directus 11 + Postgres 16 CMS

Earned its file as a distinct domain: the CMS half of the system. Compose + schema-as-code + seed pipeline carry their own commands and Directus-11 traps.

## OVERVIEW
Two-service compose stack plus dependency-free Node 24 scripts that build the content model and push seed data. The frontend reads this CMS directly; nothing else writes it.

## STRUCTURE
```
docker-compose.yml   # db (postgres:16-alpine, pg_isready gate) + directus (directus/directus:11)
.env.example         # all vars optional; compose repeats the same defaults inline
schema/snapshot.json # checked-in snapshot (directus 11.17.4) — relations:[] (see ANTI-PATTERNS)
seed/
├── setup-schema.mjs # idempotent: 3 collections, 2 m2o relations, public read permission
├── seed.mjs         # upsert 3 animes, then streams/downloads per anime
├── import-sql.mjs   # offline legacy-SQL -> data/animes.json (never contacts Directus)
└── data/            # animes.json(3) streams.json(28) downloads.json(12) weebonime_master.sql
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Boot / operate stack | README.md, docker-compose.yml | db must pass pg_isready before directus starts; directus itself has no compose healthcheck |
| Change the content model | seed/setup-schema.mjs | the only place collections, relations, and permissions are created |
| Re-apply checked-in schema | schema/snapshot.json | `docker compose exec -T directus npx directus schema apply --dry-run /directus/schema/snapshot.json` |
| Seed / re-seed content | seed/seed.mjs | shells out to setup-schema first unless `--skip-schema` |
| Rebuild animes.json | seed/import-sql.mjs | reads data/weebonime_master.sql locally |

## CONVENTIONS
- Scripts are dependency-free Node 24, REST-only, idempotent (GET before every POST). Auth: `DIRECTUS_TOKEN` short-circuits login, else `DIRECTUS_ADMIN_EMAIL` + `DIRECTUS_ADMIN_PASSWORD`; `DIRECTUS_URL` defaults to `http://localhost:8055`.
- Integer auto-increment `id` PKs everywhere; `published` boolean (default true) is the flag the frontend filters on.
- `genres` is comma-separated TEXT, not JSON, so `filter[genres][_contains]` works; do not convert it to a json field.
- seed.mjs merges a hardcoded `META` map (synopsis/score/genres/trailer…) for exactly MAL ids 32182, 32949, 36474 — new animes get only title/published/poster.
- Without `--force`, seed.mjs skips streams+downloads for any anime that already has at least one stream.

## ANTI-PATTERNS (THIS PROJECT)
- Never trust `schema/snapshot.json` alone to rebuild relations: its `relations` array is empty and FK columns are null; only `setup-schema.mjs` materializes the two `anime` m2o relations.
- `docker compose down -v` destroys the seeded `directus-db` volume; plain `down` keeps it.
- Do not run seed scripts before `curl /server/health` returns `{"status":"ok"}` — Directus bootstraps admin and system tables on first boot.
- Do not import the legacy `anime_details` table (0 rows); richer metadata is hardcoded in seed.mjs.

## COMMANDS
```bash
cd directus
cp .env.example .env && docker compose --env-file .env up -d
curl -s http://localhost:8055/server/health          # wait for {"status":"ok"}
node seed/setup-schema.mjs    # --dry-run prints the request plan; zero network calls
node seed/seed.mjs            # flags: --skip-schema, --force
node seed/import-sql.mjs      # prints: IMPORTED N animes -> rewrites data/animes.json
docker compose --env-file .env logs -f directus
```

## NOTES — Directus 11 traps already handled by setup-schema.mjs
- Missing collections/fields answer 403 FORBIDDEN (not 404) for admin tokens.
- The public policy reports name `$t:public_label`; stable fallback id `abf8a154-5b1c-4a46-ac9c-7300570f4f17`.
- A read permission created without `fields: ["*"]` returns bare primary keys only; the script repairs it.
- A stale `special` cast (e.g. `cast-json`) survives a type PATCH unless `special: null` is sent with it.
- Permissions are policy-based since 11.0.0 (`role` is gone). Relations use the `{collection_many, collection_one, field_many}` shape.
