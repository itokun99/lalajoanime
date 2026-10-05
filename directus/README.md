# Directus 11

Local Directus 11 stack for lalajoanime: a PostgreSQL 16 database plus the
Directus server, both managed by Docker Compose.

## Files

- `docker-compose.yml` - `db` (postgres:16-alpine) and `directus` (directus/directus:11) services.
- `.env.example` - every supported environment variable with its default value.
- `schema/` - mounted at `/directus/schema` so schema snapshots can be checked in.
- `seed/` - scripts that create the schema and load sample data.

## Getting started

Copy the environment template:

```bash
cp .env.example .env
```

Start the stack in the background:

```bash
docker compose --env-file .env up -d
```

Wait until Directus reports itself healthy:

```bash
curl http://localhost:8055/server/health
```

The response must be JSON containing a status of `ok`:

```json
{ "status": "ok" }
```

Once healthy, create the collections and fields:

```bash
node seed/setup-schema.mjs
```

Then load the seed data:

```bash
node seed/seed.mjs
```

## Admin UI

Open the admin interface at http://localhost:8055/admin and sign in with
`ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`
(`admin@example.com` / `admin1234` with the defaults).

## Useful commands

```bash
# View logs
docker compose --env-file .env logs -f directus

# Stop the stack (keeps the database volume)
docker compose --env-file .env down

# Stop the stack and delete the database volume
docker compose --env-file .env down -v
```
