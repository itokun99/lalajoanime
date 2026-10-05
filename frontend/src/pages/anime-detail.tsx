import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Prompt } from "@/components/ui/prompt";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAnime, useDownloads, useStreams } from "@/api/queries";
import type { Anime, AnimeDownload, AnimeStream } from "@/api/types";
import { formatDate, qualityLabel } from "@/lib/format";
import { slugify } from "@/lib/slug";

function toEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  if (url.startsWith("https://www.youtube.com/embed/")) return url;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length >= 2 && ["embed", "shorts", "live"].includes(parts[0])) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }
      return null;
    }
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
      return null;
    }
    return null;
  } catch {
    return null;
  }
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="font-mono text-sm font-medium uppercase tracking-[0.08em] text-primary">
      {children}
    </h2>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-1.5 font-mono text-sm last:border-b-0">
      <span className="shrink-0 uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}

function MetaList({ anime }: { anime: Anime }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {anime.score != null ? (
          <Badge variant="default">[ SKOR {String(anime.score)} ]</Badge>
        ) : null}
        {anime.status ? (
          <Badge variant="secondary">[ {anime.status.toUpperCase()} ]</Badge>
        ) : null}
        {anime.type ? (
          <Badge variant="outline">[ {anime.type.toUpperCase()} ]</Badge>
        ) : null}
      </div>
      <div className="mt-3">
        <MetaItem label="STUDIO" value={anime.studios || "-"} />
        <MetaItem label="DURASI" value={anime.duration || "-"} />
        <MetaItem
          label="TOTAL EPISODE"
          value={
            anime.total_episodes != null ? String(anime.total_episodes) : "-"
          }
        />
        <MetaItem label="RILIS" value={formatDate(anime.release_date)} />
        <MetaItem label="MAL ID" value={String(anime.mal_id)} />
      </div>
      {anime.genres && anime.genres.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {anime.genres.map((genre) => (
            <Badge key={genre} variant="outline">
              {genre.toUpperCase()}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EpisodeList({ streams }: { streams: AnimeStream[] }) {
  if (streams.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">
        [ BELUM ADA EPISODE ]
      </p>
    );
  }
  const sorted = [...streams].sort((a, b) => {
    const ea = a.episode_number ?? Number.MAX_SAFE_INTEGER;
    const eb = b.episode_number ?? Number.MAX_SAFE_INTEGER;
    if (ea !== eb) return ea - eb;
    return a.quality.localeCompare(b.quality);
  });
  return (
    <ul className="divide-y divide-border border border-border bg-card">
      {sorted.map((stream) => (
        <li key={stream.id}>
          <Link
            to={`/watch/${stream.id}`}
            className="flex items-center justify-between gap-3 px-3 py-2 font-mono text-sm transition-colors hover:bg-muted/60 focus-visible:outline-1 focus-visible:outline-ring"
          >
            <span className="min-w-0 truncate text-foreground">
              <span className="text-primary">$ </span>
              EP {stream.episode_number ?? "-"} — {stream.episode_title}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <Badge variant="secondary">{qualityLabel(stream.quality)}</Badge>
              <span className="uppercase tracking-[0.08em] text-info">
                [ WATCH ]
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function DownloadTable({ downloads }: { downloads: AnimeDownload[] }) {
  if (downloads.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">
        [ BELUM ADA LINK DOWNLOAD ]
      </p>
    );
  }
  const sorted = [...downloads].sort((a, b) => {
    const q = a.quality.localeCompare(b.quality);
    if (q !== 0) return q;
    return a.server_name.localeCompare(b.server_name);
  });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SERVER</TableHead>
          <TableHead>KUALITAS</TableHead>
          <TableHead>UKURAN</TableHead>
          <TableHead className="text-right">LINK</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.server_name}</TableCell>
            <TableCell>
              <Badge variant="outline">{qualityLabel(item.quality)}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {item.size || "-"}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="link" size="sm" asChild>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="uppercase tracking-[0.08em]"
                >
                  [ UNDUH ]
                </a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

export default function AnimeDetail() {
  const { malId } = useParams();
  const { data: anime, isLoading } = useAnime(malId);
  const { data: streams = [] } = useStreams(anime?.id);
  const { data: downloads = [] } = useDownloads(anime?.id);

  useEffect(() => {
    document.title = anime ? `${anime.title} | LALAJOANIME` : "LALAJOANIME";
    return () => {
      document.title = "LALAJOANIME";
    };
  }, [anime]);

  if (isLoading) {
    return (
      <div className="font-mono">
        <Prompt>memuat detail anime ...</Prompt>
        <div className="mt-4">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 font-mono">
        <p className="text-sm uppercase tracking-[0.08em] text-muted-foreground">
          [ ANIME TIDAK DITEMUKAN ]
        </p>
        <Button variant="outline" asChild>
          <Link to="/">$ KEMBALI KE BERANDA</Link>
        </Button>
      </div>
    );
  }

  const embedUrl = anime.trailer_url ? toEmbedUrl(anime.trailer_url) : null;
  const watchHref =
    streams.length > 0
      ? `/watch/${streams[0].id}`
      : `/anime-list`;

  return (
    <div className="font-mono">
      <Prompt>
        buka detail --mal-id {anime.mal_id}
      </Prompt>

      <div className="mt-4 grid gap-6 md:grid-cols-[280px_1fr]">
        <Card className="glow-box h-fit overflow-hidden">
          {anime.poster_url ? (
            <img
              src={anime.poster_url}
              alt={`Poster ${anime.title}`}
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted text-xs uppercase tracking-[0.08em] text-muted-foreground">
              [ TANPA POSTER ]
            </div>
          )}
          <CardContent className="pt-4">
            <Button className="w-full uppercase tracking-[0.08em]" asChild>
              <Link
                to={watchHref}
                state={{ animeTitle: anime.title, slug: slugify(anime.title) }}
              >
                {streams.length > 0
                  ? "[ TONTON SEKARANG ]"
                  : "[ CARI ANIME LAIN ]"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="min-w-0">
          <h1 className="glow-text text-2xl font-bold uppercase tracking-[0.08em] text-foreground">
            {anime.title}
          </h1>
          {anime.alternative_title ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {anime.alternative_title}
            </p>
          ) : null}

          <div className="mt-4">
            <MetaList anime={anime} />
          </div>

          <Separator className="dashed-divider my-6" />

          <section>
            <SectionHeading>&gt; SINOPSIS</SectionHeading>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {anime.synopsis || "Sinopsis belum tersedia."}
            </p>
          </section>

          {embedUrl ? (
            <section className="mt-6">
              <SectionHeading>&gt; TRAILER</SectionHeading>
              <div className="mt-2 border border-border bg-card">
                <iframe
                  src={embedUrl}
                  title={`Trailer ${anime.title}`}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          <Separator className="dashed-divider my-6" />

          <section>
            <SectionHeading>&gt; DAFTAR EPISODE</SectionHeading>
            <div className="mt-2">
              <EpisodeList streams={streams} />
            </div>
          </section>

          <Separator className="dashed-divider my-6" />

          <section>
            <SectionHeading>&gt; DOWNLOAD</SectionHeading>
            <div className="mt-2">
              <DownloadTable downloads={downloads} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
