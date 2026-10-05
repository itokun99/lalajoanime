import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAnimeList } from "@/api/queries";
import type { Anime } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Prompt } from "@/components/ui/prompt";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/lib/slug";

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
] as const;

const ALL_GENRES = "SEMUA";

const SORT_OPTIONS = [
  { value: "-date_updated", label: "Terbaru" },
  { value: "title", label: "Judul" },
  { value: "-score", label: "Skor" },
] as const;

const PAGE_SIZE = 24;

function AnimeCard({ anime }: { anime: Anime }) {
  const to = `/anime/${anime.mal_id}/${slugify(anime.title)}`;
  return (
    <Link to={to} className="outline-none focus-visible:[box-shadow:0_0_12px_rgba(0,255,136,0.35)]">
      <Card className="h-full transition-[box-shadow] duration-150 hover:glow-box">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {anime.poster_url ? (
            <img
              src={anime.poster_url}
              alt={anime.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted-foreground">
              [ NO POSTER ]
            </div>
          )}
          {anime.score !== null && anime.score !== undefined ? (
            <Badge variant="default" className="absolute top-2 left-2">
              {Number(anime.score).toFixed(1)}
            </Badge>
          ) : null}
        </div>
        <CardContent className="flex flex-1 flex-col gap-1.5">
          <p className="line-clamp-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-foreground">
            {anime.title}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-1">
            {anime.type ? (
              <Badge variant="secondary">[ {anime.type} ]</Badge>
            ) : null}
            {anime.genres?.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function AnimeGrid({ items }: { items: Anime[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 border border-border bg-card p-3">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function AnimeList() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [genre, setGenre] = useState<string>(ALL_GENRES);
  const [sort, setSort] = useState<string>("-date_updated");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, genre, sort]);

  const { data, isPending, isError } = useAnimeList({
    search: debouncedQuery || undefined,
    genre: genre === ALL_GENRES ? undefined : genre,
    sort,
    limit: PAGE_SIZE,
    page,
  });

  const items = data ?? [];
  const isLastPage = items.length < PAGE_SIZE;

  return (
    <div className="scanlines mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 font-mono">
      <div className="flex flex-col gap-1">
        <Prompt>KATALOG ANIME</Prompt>
        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
          {">"} JELAJAHI SEMUA JUDUL
          <span aria-hidden="true" className="animate-caret ml-[0.5ch] text-primary">
            ▮
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="$ cari judul anime..."
          aria-label="Cari anime"
          className="sm:max-w-sm"
        />
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-muted-foreground">
          <span aria-hidden="true" className="text-primary">
            {"$"}
          </span>
          URUTKAN
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Urutkan anime"
            className="h-8 border border-border bg-card px-2 font-mono text-xs uppercase tracking-[0.08em] text-foreground outline-none focus-visible:border-ring"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter genre">
        {[ALL_GENRES, ...GENRES].map((g) => (
          <Button
            key={g}
            size="sm"
            variant={genre === g ? "default" : "outline"}
            onClick={() => setGenre(g)}
            aria-pressed={genre === g}
          >
            {g === ALL_GENRES ? g : `[ ${g} ]`}
          </Button>
        ))}
      </div>

      <div className="dashed-divider" aria-hidden="true" />

      <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground" aria-live="polite">
        {">"} {isPending ? "..." : items.length} ANIME DITEMUKAN
      </p>

      {isError ? (
        <div className="flex min-h-[30vh] items-center justify-center border border-destructive/60 bg-card p-6 text-center text-xs uppercase tracking-[0.08em] text-destructive">
          [ GAGAL MEMUAT DATA ]
        </div>
      ) : isPending ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center border border-border bg-card p-6 text-center text-xs uppercase tracking-[0.08em] text-muted-foreground">
          {debouncedQuery
            ? `[ TIDAK ADA HASIL UNTUK "${debouncedQuery}" ]`
            : "[ TIDAK ADA HASIL ]"}
        </div>
      ) : (
        <AnimeGrid items={items} />
      )}

      <div className="flex items-center justify-between gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || isPending}
        >
          {"<"} SEBELUMNYA
        </Button>
        <span className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
          [ HALAMAN {page} ]
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={isPending || isLastPage}
        >
          SELANJUTNYA {">"}
        </Button>
      </div>
    </div>
  );
}
