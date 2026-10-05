/**
 * setup-schema.mjs — create the anime content model in a running Directus 11 via REST.
 *
 * Dependency-free Node 24 script. Idempotent: every create is preceded by a GET
 * existence check and existing resources are skipped.
 *
 * Usage:
 *   node directus/seed/setup-schema.mjs [--dry-run]
 *
 * Env defaults:
 *   DIRECTUS_URL            default "http://localhost:8055" (trailing slash is trimmed)
 *   DIRECTUS_ADMIN_EMAIL    admin email for POST /auth/login (required unless DIRECTUS_TOKEN is set)
 *   DIRECTUS_ADMIN_PASSWORD admin password for POST /auth/login (required unless DIRECTUS_TOKEN is set)
 *   DIRECTUS_TOKEN          when set, used directly as Bearer token and no login request is made
 *
 * Auth:
 *   - With DIRECTUS_TOKEN: `Authorization: Bearer <token>`.
 *   - Without: POST /auth/login { email, password } -> { data: { access_token } }.
 *
 * --dry-run:
 *   Prints every planned request as `METHOD /path` followed by its JSON body
 *   (GETs have no body) assuming an empty instance, and exits 0 WITHOUT any
 *   network call (login included).
 *
 * Order:
 *   1. Collections animes, anime_streams, anime_downloads (POST /collections,
 *      fields inline, meta { icon, note }).
 *   2. Relations anime_streams.anime -> animes, anime_downloads.anime -> animes
 *      (POST /relations, Directus 11 shape { collection_many, collection_one,
 *      field_many }).
 *   3. Public read: GET /policies, find policy named "$public"; per collection
 *      GET /permissions filtered by policy+collection(+action), else
 *      POST /permissions { policy, collection, action: "read",
 *      permissions: {}, validation: {}, presets: {} }.
 *
 * Verified against Directus 11 REST docs (directus.com/docs/api/*) and the
 * Directus OpenAPI spec (packages/specs): collections require `collection`
 * plus `schema` and/or `meta`, inline `fields[]` need field/type/interface;
 * relations create with collection_many/collection_one/field_many; v11.0.0
 * moved permissions from `role` to `policy`.
 */

const DRY_RUN = process.argv.includes("--dry-run");

const DIRECTUS_URL = (process.env.DIRECTUS_URL || "http://localhost:8055").replace(/\/+$/, "");
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "";
const STATIC_TOKEN = process.env.DIRECTUS_TOKEN || "";

const PUBLIC_POLICY_NAME = "$public";
const READ_ACTION = "read";

// ---------------------------------------------------------------------------
// Field / collection definitions
// ---------------------------------------------------------------------------

const idField = () => ({
  field: "id",
  type: "integer",
  meta: { hidden: true, readonly: true, interface: "input", note: "Primary key" },
  schema: { is_primary_key: true, has_auto_increment: true, is_nullable: false },
});

const dateCreatedField = () => ({
  field: "date_created",
  type: "timestamp",
  meta: {
    special: ["date-created"],
    interface: "datetime",
    readonly: true,
    hidden: true,
    note: "Created on",
  },
  schema: { is_nullable: true },
});

const dateUpdatedField = () => ({
  field: "date_updated",
  type: "timestamp",
  meta: {
    special: ["date-updated"],
    interface: "datetime",
    readonly: true,
    hidden: true,
    note: "Updated on",
  },
  schema: { is_nullable: true },
});

const str = (field, { required = false, note = null } = {}) => ({
  field,
  type: "string",
  meta: { interface: "input", required, ...(note ? { note } : {}) },
  schema: { is_nullable: !required },
});

const txt = (field) => ({
  field,
  type: "text",
  meta: { interface: "input-multiline" },
  schema: { is_nullable: true },
});

const int = (field, { unique = false } = {}) => ({
  field,
  type: "integer",
  meta: { interface: "input" },
  schema: { is_nullable: true, ...(unique ? { is_unique: true } : {}) },
});

const flt = (field) => ({
  field,
  type: "float",
  meta: { interface: "input" },
  schema: { is_nullable: true },
});

const boolDefaultTrue = (field) => ({
  field,
  type: "boolean",
  meta: { interface: "boolean" },
  schema: { is_nullable: false, default_value: true },
});

const m2oField = (field) => ({
  field,
  type: "integer",
  meta: { special: ["m2o"], interface: "select-dropdown-m2o" },
  schema: { is_nullable: true },
});

const COLLECTIONS = [
  {
    collection: "animes",
    meta: { icon: "movie", note: "Anime catalogue entries synced from external sources." },
    schema: {},
    fields: [
      idField(),
      int("mal_id", { unique: true }),
      str("title", { required: true }),
      str("alternative_title"),
      str("type"),
      str("status"),
      flt("score"),
      str("studios"),
      str("duration"),
      int("total_episodes"),
      { field: "genres", type: "text", meta: { interface: "tags" }, schema: { is_nullable: true } },
      {
        field: "release_date",
        type: "date",
        meta: { interface: "datetime" },
        schema: { is_nullable: true },
      },
      str("trailer_url"),
      txt("synopsis"),
      str("poster_url"),
      boolDefaultTrue("published"),
      dateCreatedField(),
      dateUpdatedField(),
    ],
  },
  {
    collection: "anime_streams",
    meta: { icon: "play_arrow", note: "Stream links per anime episode." },
    schema: {},
    fields: [
      idField(),
      m2oField("anime"),
      int("episode_number"),
      str("episode_title", { required: true }),
      str("quality"),
      str("link"),
      str("thumbnail_url"),
      boolDefaultTrue("published"),
      dateCreatedField(),
      dateUpdatedField(),
    ],
  },
  {
    collection: "anime_downloads",
    meta: { icon: "download", note: "Download links per anime." },
    schema: {},
    fields: [
      idField(),
      m2oField("anime"),
      str("server_name"),
      str("link"),
      str("size"),
      str("quality"),
      boolDefaultTrue("published"),
      dateCreatedField(),
      dateUpdatedField(),
    ],
  },
];

const RELATIONS = [
  { collection_many: "anime_streams", collection_one: "animes", field_many: "anime" },
  { collection_many: "anime_downloads", collection_one: "animes", field_many: "anime" },
];

const PERMISSION_COLLECTIONS = ["animes", "anime_streams", "anime_downloads"];

// ---------------------------------------------------------------------------
// Dry-run plan (no network): what a fresh instance would need, in order
// ---------------------------------------------------------------------------

function buildDryRunPlan() {
  const plan = [];
  if (STATIC_TOKEN) {
    plan.push({ method: "NOTE", path: "(auth via DIRECTUS_TOKEN, no login request)", body: null });
  } else {
    plan.push({
      method: "POST",
      path: "/auth/login",
      body: { email: ADMIN_EMAIL || "<DIRECTUS_ADMIN_EMAIL>", password: "*** (redacted)" },
    });
  }
  for (const def of COLLECTIONS) {
    plan.push({ method: "GET", path: `/collections/${def.collection}`, body: null });
    plan.push({
      method: "POST",
      path: "/collections",
      body: { collection: def.collection, meta: def.meta, schema: def.schema, fields: def.fields },
    });
  }
  for (const rel of RELATIONS) {
    plan.push({
      method: "GET",
      path:
        `/relations?filter[many_collection][_eq]=${rel.collection_many}` +
        `&filter[many_field][_eq]=${rel.field_many}`,
      body: null,
    });
    plan.push({ method: "POST", path: "/relations", body: { ...rel } });
  }
  plan.push({ method: "GET", path: "/policies?limit=-1", body: null });
  for (const collection of PERMISSION_COLLECTIONS) {
    plan.push({
      method: "GET",
      path:
        `/permissions?filter[policy][_eq]=<${PUBLIC_POLICY_NAME} policy id>` +
        `&filter[collection][_eq]=${collection}&filter[action][_eq]=${READ_ACTION}`,
      body: null,
    });
    plan.push({
      method: "POST",
      path: "/permissions",
      body: {
        policy: `<${PUBLIC_POLICY_NAME} policy id>`,
        collection,
        action: READ_ACTION,
        permissions: {},
        validation: {},
        presets: {},
      },
    });
  }
  return plan;
}

function printPlan(plan) {
  for (const step of plan) {
    console.log(`${step.method} ${step.path}`);
    if (step.body !== null && step.body !== undefined) {
      console.log(JSON.stringify(step.body, null, 2));
    }
  }
}

if (DRY_RUN) {
  printPlan(buildDryRunPlan());
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Live mode (idempotent: GET before POST, skip what exists)
// ---------------------------------------------------------------------------

async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
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
    const err = new Error(`${method} ${path} -> ${res.status} ${detail}`);
    err.status = res.status;
    err.payload = json;
    throw err;
  }
  return json;
}

// Directus 11 answers GET /collections/<missing> and GET /fields/<coll>/<missing>
// with 403 FORBIDDEN for admin tokens (not 404), so both codes mean "missing".
const isNotFound = (err) => err?.status === 404 || err?.status === 403;

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

async function ensureCollection(def, token) {
  try {
    await api(`/collections/${def.collection}`, { token });
    console.log(`skip collection ${def.collection} (exists)`);
  } catch (err) {
    if (!isNotFound(err)) throw err;
    await api("/collections", {
      method: "POST",
      token,
      body: { collection: def.collection, meta: def.meta, schema: def.schema, fields: def.fields },
    });
    console.log(`created collection ${def.collection}`);
    return;
  }
  // Collection exists: ensure every declared field exists (and has the declared type).
  for (const f of def.fields) {
    try {
      const existing = (await api(`/fields/${def.collection}/${f.field}`, { token }))?.data;
      if (existing && f.type && existing.type !== f.type) {
        await api(`/fields/${def.collection}/${f.field}`, {
          method: "PATCH",
          token,
          // `special: null` clears a stale cast (e.g. cast-json) that would
          // otherwise keep the old type in force after the PATCH.
          body: { type: f.type, meta: { special: null, ...f.meta }, schema: f.schema },
        });
        console.log(`updated field ${def.collection}.${f.field} (type ${existing.type} -> ${f.type})`);
      }
    } catch (err) {
      if (!isNotFound(err)) throw err;
      await api(`/fields/${def.collection}`, {
        method: "POST",
        token,
        body: { field: f.field, type: f.type, meta: f.meta, schema: f.schema },
      });
      console.log(`created field ${def.collection}.${f.field}`);
    }
  }
}

async function ensureRelation(rel, token) {
  const q =
    `?filter[many_collection][_eq]=${encodeURIComponent(rel.collection_many)}` +
    `&filter[many_field][_eq]=${encodeURIComponent(rel.field_many)}`;
  const json = await api(`/relations${q}`, { token });
  if (Array.isArray(json?.data) && json.data.length > 0) {
    console.log(`skip relation ${rel.collection_many}.${rel.field_many} (exists)`);
    return;
  }
  await api("/relations", { method: "POST", token, body: { ...rel } });
  console.log(`created relation ${rel.collection_many}.${rel.field_many} -> ${rel.collection_one}`);
}

async function ensurePublicRead(token) {
  const json = await api("/policies?limit=-1", { token });
  const policies = Array.isArray(json?.data) ? json.data : [];
  // Directus 11 returns the public policy with a translated label
  // ("$t:public_label") rather than the literal "$public"; the well-known id is
  // a stable fallback across versions.
  const PUBLIC_POLICY_ID_FALLBACK = "abf8a154-5b1c-4a46-ac9c-7300570f4f17";
  const pub = policies.find(
    (p) =>
      p?.name === PUBLIC_POLICY_NAME ||
      p?.name === "$t:public_label" ||
      p?.id === PUBLIC_POLICY_ID_FALLBACK,
  );
  if (!pub?.id) {
    throw new Error(`Public policy named "${PUBLIC_POLICY_NAME}" not found; cannot grant public read.`);
  }
  for (const collection of PERMISSION_COLLECTIONS) {
    const q =
      `?filter[policy][_eq]=${encodeURIComponent(pub.id)}` +
      `&filter[collection][_eq]=${encodeURIComponent(collection)}` +
      `&filter[action][_eq]=${READ_ACTION}`;
    const found = await api(`/permissions${q}`, { token });
    const existing = Array.isArray(found?.data) ? found.data[0] : null;
    if (existing?.id) {
      const fields = existing.fields;
      const allowsAll = Array.isArray(fields) && fields.includes("*");
      if (allowsAll) {
        console.log(`skip permission read ${collection} (exists)`);
        continue;
      }
      // A read permission created without `fields` blocks every field
      // (Directus answers with bare primary keys). Repair it to allow all.
      await api(`/permissions/${existing.id}`, {
        method: "PATCH",
        token,
        body: { fields: ["*"] },
      });
      console.log(`updated permission read ${collection} (fields -> ["*"]`) ;
      continue;
    }
    await api("/permissions", {
      method: "POST",
      token,
      body: {
        policy: pub.id,
        collection,
        action: READ_ACTION,
        permissions: {},
        validation: {},
        presets: {},
        fields: ["*"],
      },
    });
    console.log(`created permission read ${collection}`);
  }
}

try {
  const token = await login();
  for (const def of COLLECTIONS) await ensureCollection(def, token);
  for (const rel of RELATIONS) await ensureRelation(rel, token);
  await ensurePublicRead(token);
  console.log("Schema setup complete.");
} catch (err) {
  console.error(`setup-schema failed: ${err.message}`);
  process.exit(1);
}
