import { Skeleton } from "@/components/ui/skeleton";
import { AnimeCard } from "./anime-card";
import type { Anime } from "@/api/types";

export function AnimeGrid({ animes, loading }: { animes: Anime[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="border border-border bg-card p-2 font-mono">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <div className="mt-2 flex gap-1">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}
