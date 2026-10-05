import { Link } from "react-router-dom";
import { QualityBadge } from "./quality-badge";
import { cn } from "@/lib/utils";
import type { AnimeStream, Quality } from "@/api/types";

const QUALITY_RANK: Record<Quality, number> = {
  "720p": 0,
  "480p": 1,
  "1080p": 2,
  "360p": 3,
};

function bestStream(streams: AnimeStream[]): AnimeStream {
  return [...streams].sort(
    (a, b) => (QUALITY_RANK[a.quality] ?? 99) - (QUALITY_RANK[b.quality] ?? 99),
  )[0];
}

interface EpisodeGroup {
  key: string;
  num: number | null;
  order: number;
  items: AnimeStream[];
}

export function EpisodeList({
  streams,
  activeStreamId,
}: {
  streams: AnimeStream[];
  activeStreamId?: number | string;
}) {
  const groups = new Map<string, EpisodeGroup>();
  streams.forEach((s, i) => {
    const key = s.episode_number != null ? `ep-${s.episode_number}` : `idx-${i}`;
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(s);
    } else {
      groups.set(key, { key, num: s.episode_number, order: i, items: [s] });
    }
  });
  const sorted = [...groups.values()].sort((a, b) => {
    if (a.num != null && b.num != null) return a.num - b.num;
    if (a.num != null) return -1;
    if (b.num != null) return 1;
    return a.order - b.order;
  });

  if (sorted.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">[ BELUM ADA EPISODE ]</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((g) => {
        const best = bestStream(g.items);
        const num = g.num != null ? g.num : g.order + 1;
        const title = g.items[0]?.episode_title ?? "-";
        const qualities = [...new Set(g.items.map((s) => s.quality))].sort(
          (a, b) => (QUALITY_RANK[a] ?? 99) - (QUALITY_RANK[b] ?? 99),
        );
        const isActive =
          activeStreamId != null &&
          g.items.some((s) => String(s.id) === String(activeStreamId));
        return (
          <li key={g.key}>
            <Link
              to={`/watch/${best.id}`}
              className={cn(
                "flex items-center justify-between gap-2 border bg-card px-3 py-2 font-mono transition-colors",
                isActive
                  ? "border-primary shadow-[0_0_12px_rgba(0,255,136,0.35)]"
                  : "border-border hover:border-primary",
              )}
            >
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-[0.08em] text-primary">
                  Episode {num}
                </span>
                <span className="block truncate text-sm text-foreground">{title}</span>
              </span>
              <span className="flex shrink-0 gap-1">
                {qualities.map((q) => (
                  <QualityBadge key={q} quality={q} active={isActive} />
                ))}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
