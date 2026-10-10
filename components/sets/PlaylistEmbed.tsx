interface PlaylistEmbedProps {
  src: string;
  title: string;
}

export function PlaylistEmbed({ src, title }: PlaylistEmbedProps) {
  return (
    <div className="overflow-hidden border border-ink/15 bg-ink/5">
      <iframe
        src={`${src}?utm_source=generator&theme=0`}
        title={`Плейлист «${title}»`}
        width="100%"
        height="152"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="block border-0"
      />
    </div>
  );
}
