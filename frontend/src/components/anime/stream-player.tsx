import ReactPlayer from "react-player";

export function StreamPlayer({ src, poster }: { src: string; poster?: string | null }) {
  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center border border-border bg-black font-mono text-sm text-muted-foreground">
        [ TIDAK ADA SUMBER VIDEO ]
      </div>
    );
  }

  return (
    <div className="scanlines aspect-video w-full border border-border bg-black">
      <ReactPlayer
        src={src}
        poster={poster ?? undefined}
        controls
        playing={false}
        width="100%"
        height="100%"
      />
    </div>
  );
}
