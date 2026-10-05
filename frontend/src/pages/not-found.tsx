import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-start justify-center gap-3 border border-dashed border-border bg-card px-6 py-8 font-mono text-sm">
      <p className="text-xs text-muted-foreground">[ 404 ]</p>
      <h1 className="text-lg tracking-[0.08em] text-foreground uppercase">
        halaman tidak ditemukan
      </h1>
      <div className="dashed-divider w-full" aria-hidden="true" />
      <p className="text-xs text-muted-foreground">
        path yang diminta tidak ada di arsip lalajoanime.
      </p>
      <Link
        to="/"
        className="text-sm text-primary hover:[text-shadow:0_0_8px_rgba(0,255,136,0.55)] hover:underline hover:underline-offset-4"
      >
        $ cd /
      </Link>
    </div>
  );
}
