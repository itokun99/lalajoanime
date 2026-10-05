import type { AnimeDownload, Quality } from "@/api/types";

const QUALITY_ORDER: Quality[] = ["360p", "480p", "720p", "1080p"];

export function DownloadTable({ downloads }: { downloads: AnimeDownload[] }) {
  if (downloads.length === 0) {
    return (
      <p className="border border-dashed border-border p-4 text-center font-mono text-sm text-muted-foreground">
        [ BELUM ADA LINK DOWNLOAD ]
      </p>
    );
  }

  const grouped = QUALITY_ORDER.map((quality) => ({
    quality,
    rows: downloads.filter((d) => d.quality === quality),
  })).filter((g) => g.rows.length > 0);

  const known = new Set<string>(QUALITY_ORDER);
  const rest = downloads.filter((d) => !known.has(d.quality));
  if (rest.length > 0) {
    grouped.push({ quality: rest[0].quality, rows: rest });
  }

  return (
    <div className="overflow-x-auto border border-border font-mono">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-card text-xs uppercase tracking-[0.08em] text-muted-foreground">
            <th className="px-3 py-2 font-medium">Server</th>
            <th className="px-3 py-2 font-medium">Ukuran</th>
            <th className="px-3 py-2 font-medium">Link</th>
          </tr>
        </thead>
        {grouped.map((g) => (
          <tbody key={g.quality}>
            <tr className="bg-muted/50">
              <td
                colSpan={3}
                className="px-3 py-1 text-xs uppercase tracking-[0.08em] text-primary"
              >
                [ {g.quality.toUpperCase()} ]
              </td>
            </tr>
            {g.rows.map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="px-3 py-2 text-foreground">{d.server_name}</td>
                <td className="px-3 py-2 text-muted-foreground">{d.size ?? "-"}</td>
                <td className="px-3 py-2">
                  <a
                    href={d.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-info hover:underline"
                  >
                    [ AMBIL ]
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
