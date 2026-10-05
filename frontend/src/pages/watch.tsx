import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DownloadTable,
  EpisodeList,
  QualityBadge,
  SectionHeading,
  StreamPlayer,
} from "@/components/anime";
import { useDownloads, useStream, useStreams } from "@/api/queries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/lib/slug";

const QUALITY_ORDER = ["360p", "480p", "720p", "1080p"];

function qualityRank(q: string): number {
  const i = QUALITY_ORDER.indexOf(q);
  return i === -1 ? 99 : i;
}

export default function Watch() {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const streamQuery = useStream(streamId);
  const stream = streamQuery.data ?? null;
  const streamsQuery = useStreams(stream?.anime.id);
  const downloadsQuery = useDownloads(stream?.anime.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [streamId]);

  useEffect(() => {
    if (stream) {
      const ep =
        stream.episode_number != null ? ` EP${stream.episode_number}` : "";
      document.title = `${stream.anime.title}${ep} [${stream.quality.toUpperCase()}] -- lalajoanime`;
    } else if (!streamQuery.isPending) {
      document.title = "[ STREAM TIDAK DITEMUKAN ] -- lalajoanime";
    }
  }, [stream, streamQuery.isPending]);

  if (!streamId || (!streamQuery.isPending && !stream)) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-start justify-center gap-3 border border-dashed border-border bg-card px-6 py-8 font-mono text-sm">
        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
          [ WATCH ]
        </p>
        <h1 className="text-lg uppercase tracking-[0.08em] text-foreground">
          [ STREAM TIDAK DITEMUKAN ]
        </h1>
        <div className="dashed-divider w-full" aria-hidden="true" />
        <p className="text-xs text-muted-foreground">
          stream yang diminta tidak ada di arsip lalajoanime.
        </p>
        <Link
          to="/"
          className="text-sm text-primary hover:underline hover:underline-offset-4 hover:[text-shadow:0_0_8px_rgba(0,255,136,0.55)]"
        >
          $ cd /
        </Link>
      </div>
    );
  }

  if (!stream) {
    return (
      <div
        className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 font-mono"
        aria-busy="true"
      >
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="aspect-video w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-20" />
        </div>
      </div>
    );
  }

  const { anime } = stream;
  const allStreams = streamsQuery.data ?? [];
  const sameEpisode = allStreams.filter(
    (s) => s.episode_number === stream.episode_number,
  );
  const qualityOptions = (
    sameEpisode.length > 0
      ? sameEpisode.map((s) => ({ id: s.id, quality: s.quality }))
      : [{ id: stream.id, quality: stream.quality }]
  ).sort((a, b) => qualityRank(a.quality) - qualityRank(b.quality));
  const downloads = downloadsQuery.data ?? [];
  const episodeLabel =
    stream.episode_number != null ? `EP${stream.episode_number}` : "EP-";
  const detailHref = `/anime/${anime.mal_id}/${slugify(anime.title)}`;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 font-mono">
      <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
        [ WATCH ]
      </p>

      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-base font-bold uppercase tracking-[0.08em] text-foreground">
          <span aria-hidden="true" className="text-primary">
            {"> "}
          </span>
          {anime.title}
        </h1>
        <span className="text-sm text-muted-foreground">
          {episodeLabel} -- {stream.episode_title}
        </span>
        <QualityBadge quality={stream.quality} active />
      </header>

      <StreamPlayer
        src={stream.link}
        poster={stream.thumbnail_url ?? anime.poster_url}
      />

      <section aria-label="pilih kualitas" className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">
          <span aria-hidden="true" className="text-primary">
            $
          </span>{" "}
          pilih_kualitas --episode {episodeLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          {qualityOptions.map((opt) => {
            const isActive = String(opt.id) === String(streamId);
            return (
              <Button
                key={opt.id}
                size="sm"
                variant={isActive ? "default" : "outline"}
                aria-pressed={isActive}
                onClick={() => navigate(`/watch/${opt.id}`)}
                className={isActive ? "glow-box" : undefined}
              >
                [{opt.quality.toUpperCase()}]
              </Button>
            );
          })}
        </div>
      </section>

      <div className="dashed-divider w-full" aria-hidden="true" />

      <section aria-label="daftar episode" className="flex flex-col gap-3">
        <SectionHeading label="EPISODE" hint={`${allStreams.length} stream`} />
        {streamsQuery.isPending ? (
          <div className="flex flex-col gap-2" aria-busy="true">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <EpisodeList streams={allStreams} activeStreamId={stream.id} />
        )}
      </section>

      <section aria-label="unduhan" className="flex flex-col gap-3">
        <SectionHeading label="DOWNLOAD" />
        {downloadsQuery.isPending ? (
          <Skeleton className="h-32 w-full" aria-busy="true" />
        ) : (
          <DownloadTable downloads={downloads} />
        )}
      </section>

      <div className="dashed-divider w-full" aria-hidden="true" />

      <Link
        to={detailHref}
        className="text-sm text-muted-foreground hover:text-primary hover:underline hover:underline-offset-4"
      >
        {"< "}kembali ke detail anime
      </Link>
    </div>
  );
}
