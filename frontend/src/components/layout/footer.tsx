export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="dashed-divider" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 font-mono text-xs text-muted-foreground">
        <p>lalajoanime — nonton anime subtitle indonesia.</p>
        <p>
          <span className="text-primary">$ </span>
          exit -- terima kasih sudah mampir
        </p>
      </div>
    </footer>
  );
}

export default Footer;
