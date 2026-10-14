interface PlaylistEmbedProps {
  src: string;
  title: string;
}

export function PlaylistEmbed({ src, title }: PlaylistEmbedProps) {
  return (
    <div className="overflow-hidden border border-ink/15 bg-[#121212]">
      <iframe
        src={`${src}?utm_source=generator&theme=0`}
        title={`Плейлист «${title}»`}
        width="100%"
        height="152"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        // Документ Spotify светлый по color-scheme. Если iframe унаследует dark от тёмной темы, браузер подложит
        // под него белый фон, и он проступит в скруглённых углах карточки. Совпадающая схема оставляет фон прозрачным.
        className="block border-0 [color-scheme:light]"
      />
    </div>
  );
}
