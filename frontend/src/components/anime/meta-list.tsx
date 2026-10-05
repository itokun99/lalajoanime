import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";
import type { Anime } from "@/api/types";

export function MetaList({ anime }: { anime: Anime }) {
  const rows: Array<[string, ReactNode]> = [
    ["Judul", anime.title],
    ["Judul Alternatif", anime.alternative_title ?? "-"],
    ["Tipe", anime.type ?? "-"],
    ["Status", anime.status ?? "-"],
    ["Skor", anime.score != null ? anime.score.toFixed(1) : "-"],
    ["Studio", anime.studios ?? "-"],
    ["Durasi", anime.duration ?? "-"],
    ["Total Episode", anime.total_episodes != null ? String(anime.total_episodes) : "-"],
    ["Rilis", formatDate(anime.release_date)],
  ];

  return (
    <dl className="font-mono text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="flex gap-2 border-b border-dashed border-border py-1.5">
          <dt className="w-36 shrink-0 pt-0.5 text-xs uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </dt>
          <dd className="min-w-0 text-foreground">{value}</dd>
        </div>
      ))}
      <div className="flex gap-2 py-1.5">
        <dt className="w-36 shrink-0 pt-0.5 text-xs uppercase tracking-[0.08em] text-muted-foreground">
          Genre
        </dt>
        <dd className="flex min-w-0 flex-wrap gap-1">
          {anime.genres && anime.genres.length > 0 ? (
            anime.genres.map((g) => (
              <span
                key={g}
                className="inline-flex items-center border border-border px-1.5 py-0.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground"
              >
                [{g.toUpperCase()}]
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </dd>
      </div>
    </dl>
  );
}
