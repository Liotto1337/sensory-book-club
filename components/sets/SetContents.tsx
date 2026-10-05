import type { SetWithBook } from "@/types";

export function SetContents({ set }: { set: SetWithBook }) {
  const items = [
    { icon: "📖", title: "Книга", text: `«${set.book.title}», ${set.book.author}` },
    { icon: "🫙", title: "Аромат", text: set.scent },
    { icon: "🎧", title: "Плейлист", text: set.playlistTitle },
    { icon: "🤲", title: "Тактильный предмет", text: set.tactile },
    { icon: "✉️", title: "Карточка-инструкция", text: set.instructionCard },
  ];

  return (
    <ul className="divide-y divide-ink/5 rounded-card bg-linen shadow-soft">
      {items.map((item) => (
        <li key={item.title} className="flex gap-4 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-sand text-lg" aria-hidden>
            {item.icon}
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{item.title}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
