import { cn } from "@/lib/utils";
import type { Quality } from "@/api/types";

export function QualityBadge({ quality, active }: { quality: Quality; active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em]",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-transparent text-muted-foreground",
      )}
    >
      [{quality.toUpperCase()}]
    </span>
  );
}
