// Хвост обрезанного текста, после которого многоточие смотрится неряшливо: «раз два,…»
const TRAILING_PUNCTUATION = /[\s,;:—-]+$/;

/** Обрезает текст по границе слова, не длиннее max символов, и добавляет «…». Слово без пробелов режется по max. */
export function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.search(/\s\S*$/);
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(TRAILING_PUNCTUATION, "")}…`;
}
