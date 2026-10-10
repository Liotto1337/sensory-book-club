import type { SetWithBook } from "@/types";

export function SetContents({ set }: { set: SetWithBook }) {
  const items = [
    { title: "Книга", text: `«${set.book.title}», ${set.book.author}` },
    { title: "Аромат", text: set.scent },
    { title: "Плейлист", text: set.playlistTitle },
    { title: "Тактильный предмет", text: set.tactile },
    { title: "Карточка-инструкция", text: set.instructionCard },
  ];

  return (
    <ol className="border-t border-ink/15">
      {items.map((item, index) => (
        <li key={item.title} className="grid grid-cols-[48px_1fr] gap-2 border-b border-ink/15 py-4">
          <span className="label pt-0.5 text-ink-muted">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <p className="font-medium text-ink">{item.title}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
