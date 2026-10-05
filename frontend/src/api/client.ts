export const DIRECTUS_URL: string =
  import.meta.env.VITE_DIRECTUS_URL || "/directus";

export class DirectusError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DirectusError";
    this.status = status;
  }
}

interface DirectusErrorBody {
  errors?: Array<{ message?: string }>;
}

export async function directusGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      search.append(key, String(value));
    }
  }
  const query = search.toString();
  const url = `${DIRECTUS_URL}${path}${query ? `?${query}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = (await res.json()) as DirectusErrorBody;
      const first = body.errors?.[0]?.message;
      if (first) message = first;
    } catch {
    }
    throw new DirectusError(message, res.status);
  }
  return (await res.json()) as T;
}
