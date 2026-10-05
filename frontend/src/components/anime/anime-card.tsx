import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { Anime } from "@/api/types";

export function AnimeCard({ anime }: { anime: Anime }) {
  const href = `/anime/${anime.mal_id}/${slugify(anime.title)}`;
  const score = anime.score != null ? anime.score.toFixed(1) : "-";
  const eps = anime.total_episodes != null ? `${anime.total_episodes} EPS` : "- EPS";

  return (
    <Link
      to={href}
      className={cn(
        "group flex flex-col overflow-hidden border border-border bg-card font-mono transition-colors",
        "hover:border-primary hover:shadow-[0_0_12px_rgba(0,255,136,0.35)]",
      )}
    >
      {anime.poster_url ? (
        <img
          src={anime.poster_url}
          alt={anime.title}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted text-xs uppercase tracking-[0.08em] text-muted-foreground">
          [ NO POSTER ]
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-2">
        <p className="line-clamp-2 text-sm leading-snug text-foreground">{anime.title}</p>
        <div className="mt-auto flex flex-wrap gap-1">
          {anime.type ? <Badge variant="outline">{anime.type}</Badge> : null}
          <Badge variant="secondary">{score}</Badge>
          <Badge variant="secondary">{eps}</Badge>
        </div>
      </div>
    </Link>
  );
}
