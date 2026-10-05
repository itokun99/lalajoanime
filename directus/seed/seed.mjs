/**
 * seed.mjs — push seed content into a running Directus 11 instance.
 *
 * Dependency-free Node 24 script. Steps:
 *   1. Run `node setup-schema.mjs` in this directory (skip with --skip-schema).
 *   2. Login via POST /auth/login, or use DIRECTUS_TOKEN directly.
 *   3. Upsert animes by mal_id (GET /items/animes?filter[mal_id][_eq], then
 *      POST for new rows or PATCH for existing ones), merging each row of
 *      data/animes.json with richer demo metadata below.
 *   4. Per anime: skip streams+downloads when the anime already has streams
 *      (GET /items/anime_streams?filter[anime][_eq]&limit=1) unless --force;
 *      otherwise POST rows from data/streams.json and data/downloads.json,
 *      resolving the anime id through the mal_id map built in step 3.
 *   5. Print a summary line per step; exit 0 on success, non-zero with the
 *      Directus error message on failure.
 *
 * Usage:
 *   node directus/seed/seed.mjs [--skip-schema] [--force]
 *
 * Env defaults:
 *   DIRECTUS_URL            default "http://localhost:8055" (trailing slash trimmed)
 *   DIRECTUS_ADMIN_EMAIL    admin email for POST /auth/login (unless DIRECTUS_TOKEN)
 *   DIRECTUS_ADMIN_PASSWORD admin password for POST /auth/login (unless DIRECTUS_TOKEN)
 *   DIRECTUS_TOKEN          when set, used as Bearer token, no login request
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const SKIP_SCHEMA = process.argv.includes("--skip-schema");
const FORCE = process.argv.includes("--force");

const DIRECTUS_URL = (process.env.DIRECTUS_URL || "http://localhost:8055").replace(/\/+$/, "");
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "";
const STATIC_TOKEN = process.env.DIRECTUS_TOKEN || "";

// Richer demo metadata per anime, keyed by MAL id from the legacy dump.
const META = {
  32182: {
    type: "TV",
    status: "Finished Airing",
    score: 8.5,
    studios: "Bones",
    duration: "24 min per ep",
    total_episodes: 12,
    genres: ["Action", "Comedy", "Supernatural"],
    release_date: "2016-07-12",
    trailer_url: "https://www.youtube.com/watch?v=BuWzxKRc93M",
    synopsis:
      "Shigeo Kageyama, yang dijuluki Mob, adalah siswa SMP dengan kekuatan esper yang luar biasa. " +
      "Demi menjalani kehidupan normal dan menekan emosinya, ia menjadi murid dari penipu bernama Reigen " +
      "sambil menghadapi roh jahat dan esper lain yang mengincarnya.",
  },
  32949: {
    type: "TV",
    status: "Finished Airing",
    score: 7.5,
    studios: "Lerche",
    duration: "23 min per ep",
    total_episodes: 12,
    genres: ["Drama", "Romance", "School"],
    release_date: "2017-01-13",
    trailer_url: "https://www.youtube.com/watch?v=UmngLx9-HQc",
    synopsis:
      "Hanabi dan Mugi tampak seperti pasangan SMA yang sempurna, tetapi keduanya sebenarnya " +
      "mencintai orang lain yang tak bisa mereka miliki. Mereka sepakat menjalin hubungan palsu " +
      "untuk mengobati kesepian, hingga batas antara pura-pura dan perasaan sungguhan perlahan kabur.",
  },
  36474: {
    type: "TV",
    status: "Finished Airing",
    score: 7.8,
    studios: "A-1 Pictures",
    duration: "24 min per ep",
    total_episodes: 24,
    genres: ["Action", "Adventure", "Fantasy"],
    release_date: "2018-10-07",
    trailer_url: "https://www.youtube.com/watch?v=0K62I83qanE",
    synopsis:
      "Kirito terbangun di dunia virtual misterius bernama Underworld tanpa ingatan bagaimana ia tiba di sana. " +
      "Bersama Eugeo, ia menapaki menara Central Cathedral dan mengungkap tabir Administrator " +
      "serta rahasia kelam di balik dunia Alicization.",
  },
};

const posterFor = (title) =>
  `https://placehold.co/300x450/0a110c/00ff88?text=${encodeURIComponent(title).replace(/%20/g, "+")}`;

async function api(apiPath, { method = "GET", body, token } = {}) {
  const res = await fetch(`${DIRECTUS_URL}${apiPath}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    const detail = json?.errors?.map((e) => e.message).join("; ") || text || res.statusText;
    throw new Error(`${method} ${apiPath} -> ${res.status} ${detail}`);
  }
  return json;
}

async function login() {
  if (STATIC_TOKEN) return STATIC_TOKEN;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Missing admin credentials: set DIRECTUS_ADMIN_EMAIL and DIRECTUS_ADMIN_PASSWORD, or DIRECTUS_TOKEN.",
    );
  }
  const json = await api("/auth/login", {
    method: "POST",
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  const token = json?.data?.access_token;
  if (!token) throw new Error("Login failed: no access_token in response.");
  return token;
}

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(here, "data", name), "utf8"));

try {
  // (1) Schema first, in this directory, unless skipped.
  if (SKIP_SCHEMA) {
    console.log("SCHEMA skipped (--skip-schema).");
  } else {
    const r = spawnSync("node", ["setup-schema.mjs"], { cwd: here, stdio: "inherit" });
    if (r.status !== 0) throw new Error(`setup-schema.mjs exited with code ${r.status}`);
    console.log("SCHEMA ensured via setup-schema.mjs.");
  }

  // (2) Auth.
  const token = await login();
  console.log(`LOGIN ok (${STATIC_TOKEN ? "DIRECTUS_TOKEN" : "email/password"}).`);

  // (3) Upsert animes by mal_id.
  const animes = readJson("animes.json");
  const idByMal = new Map();
  let created = 0;
  let updated = 0;
  for (const row of animes) {
    const meta = META[row.mal_id] ?? {};
    const payload = {
      mal_id: row.mal_id,
      title: row.title,
      published: row.published ?? true,
      ...meta,
      // Directus text field: store genres as a comma-separated string so that
      // filter[genres][_contains] works (json fields reject _contains in v11).
      genres: Array.isArray(meta.genres) ? meta.genres.join(", ") : meta.genres,
      poster_url: posterFor(row.title),
    };
    const found = await api(`/items/animes?filter[mal_id][_eq]=${row.mal_id}`, { token });
    const existing = found?.data?.[0];
    if (existing?.id !== undefined && existing?.id !== null) {
      const patched = await api(`/items/animes/${existing.id}`, {
        method: "PATCH",
        token,
        body: payload,
      });
      idByMal.set(row.mal_id, patched?.data?.id ?? existing.id);
      updated += 1;
    } else {
      const made = await api("/items/animes", { method: "POST", token, body: payload });
      if (made?.data?.id === undefined || made?.data?.id === null) {
        throw new Error(`POST /items/animes -> no id returned for mal_id ${row.mal_id}`);
      }
      idByMal.set(row.mal_id, made.data.id);
      created += 1;
    }
  }
  console.log(`ANIMES upserted ${animes.length} (created ${created}, updated ${updated}).`);

  // (4) Streams + downloads per anime, skipping ones that already have streams.
  const streams = readJson("streams.json");
  const downloads = readJson("downloads.json");
  let streamsPosted = 0;
  let downloadsPosted = 0;
  let skipped = 0;
  for (const [malId, animeId] of idByMal) {
    if (!FORCE) {
      const has = await api(`/items/anime_streams?filter[anime][_eq]=${animeId}&limit=1`, { token });
      if (Array.isArray(has?.data) && has.data.length > 0) {
        skipped += 1;
        continue;
      }
    }
    for (const s of streams.filter((r) => r.mal_id === malId)) {
      await api("/items/anime_streams", {
        method: "POST",
        token,
        body: {
          anime: animeId,
          episode_number: s.episode_number,
          episode_title: s.episode_title,
          quality: s.quality,
          link: s.link,
          thumbnail_url: s.thumbnail_url,
          published: true,
        },
      });
      streamsPosted += 1;
    }
    for (const d of downloads.filter((r) => r.mal_id === malId)) {
      await api("/items/anime_downloads", {
        method: "POST",
        token,
        body: {
          anime: animeId,
          server_name: d.server_name,
          link: d.link,
          size: d.size,
          quality: d.quality,
          published: true,
        },
      });
      downloadsPosted += 1;
    }
  }
  console.log(
    `EPISODES posted ${streamsPosted} streams and ${downloadsPosted} downloads (skipped ${skipped} animes with streams${FORCE ? ", force ignored" : ""}).`,
  );

  console.log("SEED complete.");
} catch (err) {
  console.error(`seed failed: ${err.message}`);
  process.exit(1);
}
