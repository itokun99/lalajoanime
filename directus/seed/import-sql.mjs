/**
 * import-sql.mjs — extract the legacy `animes` table into seed JSON.
 *
 * Reads directus/seed/data/weebonime_master.sql as plain text (the copy of
 * the legacy dump that ships with the seed; falls back to the legacy tree
 * path when the archived tree is still present).
 * (Node:fs only, no SQL eval), parses every INSERT row of table `animes`
 * (columns anime_mal_id, anime_title, publish) and writes
 * directus/seed/data/animes.json as [{ mal_id, title, published }].
 *
 * Usage:
 *   node directus/seed/import-sql.mjs
 *
 * Prints `IMPORTED N animes` and exits 0.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_SQL_PATH = path.resolve(here, "data/weebonime_master.sql");
const LEGACY_SQL_PATH = path.resolve(here, "../../legacy/backend-codeigniter/weebonime_master.sql");
const SQL_PATH = fs.existsSync(LOCAL_SQL_PATH) ? LOCAL_SQL_PATH : LEGACY_SQL_PATH;
const OUT_PATH = path.resolve(here, "data/animes.json");

const sql = fs.readFileSync(SQL_PATH, "utf8");

// Grab the VALUES block of the `animes` INSERT (up to its closing semicolon).
const insertMatch = sql.match(/INSERT INTO\s+`animes`\s*\([^)]*\)\s*VALUES\s*([\s\S]*?);/);
if (!insertMatch) {
  console.error(`import-sql failed: no INSERT INTO \`animes\` found in ${SQL_PATH}`);
  process.exit(1);
}

// Rows look like: (1, 32182, 'Mob Psycho 100', '2019-03-02 00:00:00', 1)
const rowRe = /\(\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^']|'')*)'\s*,\s*'([^']*)'\s*,\s*(\d+)\s*\)/g;
const rows = [];
for (const m of insertMatch[1].matchAll(rowRe)) {
  rows.push({
    mal_id: Number(m[2]),
    title: m[3].replace(/''/g, "'"),
    published: Number(m[5]) === 1,
  });
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(rows, null, 2) + "\n");

console.log(`IMPORTED ${rows.length} animes`);
