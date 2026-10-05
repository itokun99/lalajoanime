import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAnimeList } from "@/api/queries";
import type { Anime } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Prompt } from "@/components/ui/prompt";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { slugify } from "@/lib/slug";

const PAGE_SIZE = 12;

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 font-mono">
      <span aria-hidden="true" className="text-sm text-primary">
        &gt;
      </span>
      <h2 className="text-sm uppercase tracking-[0.08em] text-foreground">
        {children}
      </h2>
      <div aria-hidden="true" className="dashed-divider flex-1" />
    </div>
  );
}

function AnimeCard({ anime }: { anime: Anime }) {
  const slug = slugify(anime.title);
  const to = `/anime/${anime.mal_id}/${slug}`;

  return (
    <Link
      to={to}
      aria-label={anime.title}
      className="outline-none focus-visible:outline-1 focus-visible:outline-ring focus-visible:outline-offset-2"
    >
      <Card className="gap-0 py-0 transition-colors hover:border-primary hover:glow-box">
        <div className="relative aspect-[3/4] overflow-hidden border-b border-border bg-muted">
          {anime.poster_url ? (
            <img
              src={anime.poster_url}
              alt={`poster ${anime.title}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              [ NO SIGNAL ]
            </div>
          )}
          {anime.score !== null ? (
            <Badge
              variant="default"
              className="absolute top-2 left-2"
            >
              {`[ ${anime.score.toFixed(2)} ]`}
            </Badge>
          ) : null}
        </div>
        <CardContent className="flex flex-col gap-1.5 p-3">
          <p className="truncate font-mono text-xs font-medium uppercase tracking-[0.08em] text-foreground">
            {anime.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {anime.type ? (
              <Badge variant="outline">{`[ ${anime.type} ]`}</Badge>
            ) : null}
            {anime.status ? (
              <Badge variant="secondary">{anime.status.toUpperCase()}</Badge>
            ) : null}
          </div>
          <p className="font-mono text-[11px] text-muted-foreground">
            {`$ update: ${formatDate(anime.date_updated)}`}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function AnimeGrid({ items, loading }: { items: Anime[]; loading?: boolean }) {
  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label="memuat anime"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <div
            key={i}
            className="flex flex-col gap-0 overflow-hidden border border-border bg-card"
          >
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="flex flex-col gap-2 p-3">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Anime[]>([]);
  const { data, isPending, isError, error, isFetching } = useAnimeList({
    limit: PAGE_SIZE,
    page,
  });

  useEffect(() => {
    if (!data) return;
    if (page === 1) {
      setItems(data);
      return;
    }
    setItems((prev) => {
      const seen = new Set(prev.map((a) => a.id));
      const fresh = data.filter((a) => !seen.has(a.id));
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });
  }, [data, page]);

  const hasMore = data ? data.length === PAGE_SIZE : true;
  const showInitialLoading = isPending && page === 1 && items.length === 0;
  const showEmpty =
    !isPending && !isError && items.length === 0 && !showInitialLoading;
  const errorMessage =
    isError && error instanceof Error ? error.message : null;

  return (
    <div className="flex flex-col gap-6 font-mono">
      <section aria-label="hero" className="flex flex-col gap-2">
        <Prompt caret className="glow-text text-xl tracking-[0.08em]">
          lalajoanime
        </Prompt>
        <p className="text-sm text-muted-foreground">
          streaming &amp; download anime
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">[ STREAMING ]</Badge>
          <Badge variant="outline">[ DOWNLOAD ]</Badge>
        </div>
      </section>

      <div aria-hidden="true" className="dashed-divider" />

      <section aria-label="rilis terbaru" className="flex flex-col gap-4">
        <SectionHeading>RILIS TERBARU</SectionHeading>

        {isError ? (
          <p role="alert" className="text-sm text-destructive">
            {`$ error: ${errorMessage ?? "gagal memuat data"}`}
          </p>
        ) : showInitialLoading ? (
          <AnimeGrid items={[]} loading />
        ) : showEmpty ? (
          <p className="py-8 text-center text-sm uppercase tracking-[0.08em] text-muted-foreground">
            [ BELUM ADA ANIME ]
          </p>
        ) : (
          <AnimeGrid items={items} />
        )}

        {isFetching && items.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            <span aria-hidden="true" className="animate-caret text-primary">
              ▮
            </span>{" "}
            memuat...
          </p>
        ) : null}

        {!isError && !showInitialLoading && !showEmpty && hasMore ? (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={isFetching}
            >
              {isFetching ? "MEMUAT..." : "MUAT LEBIH BANYAK"}
            </Button>
          </div>
        ) : null}

        {!isError && !showInitialLoading && items.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {`$ total: ${items.length} judul`}
          </p>
        ) : null}
      </section>
    </div>
  );
}
