import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background font-mono text-foreground">
      <div
        aria-hidden="true"
        className="scanlines pointer-events-none fixed inset-0 z-50"
        style={{ position: "fixed" }}
      />
      <Header />
      <main className="min-h-[70vh] mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
      <Footer />
      <div className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-card px-4 py-1 font-mono text-xs text-muted-foreground">
        <span>NORMAL</span>
        <span aria-hidden="true">|</span>
        <span>UTF-8</span>
        <span aria-hidden="true">|</span>
        <span>LF</span>
        <span aria-hidden="true">|</span>
        <span className="truncate text-foreground">{pathname}</span>
        <span aria-hidden="true" className="animate-caret ml-auto text-primary">
          ▮
        </span>
      </div>
    </div>
  );
}

export default AppShell;
