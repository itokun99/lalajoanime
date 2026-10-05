import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-150 hover:text-primary hover:[text-shadow:0_0_8px_rgba(0,255,136,0.55)]",
    isActive ? "text-primary" : "text-muted-foreground",
  );

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          to="/"
          className="glow-text font-mono text-sm text-primary hover:[text-shadow:0_0_12px_rgba(0,255,136,0.8)]"
        >
          $ lalajoanime
        </Link>
        <nav aria-label="navigasi utama" className="flex items-center gap-4">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/anime-list" className={linkClass}>
            Anime List
          </NavLink>
        </nav>
        <span className="font-mono text-xs text-muted-foreground">
          [ v2.0 ]
        </span>
      </div>
    </header>
  );
}

export default Header;
