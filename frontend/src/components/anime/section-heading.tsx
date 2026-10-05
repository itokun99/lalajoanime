export function SectionHeading({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border pb-2 font-mono">
      <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-primary">
        <span aria-hidden="true">{"> "}</span>
        {label}
      </h2>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
  );
}
