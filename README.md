# Сенсорный книжный клуб — MVP

Подбор книг по сенсорным воспоминаниям: тест из 5 вопросов → 3 атмосферы → набор (книга + аромат + плейлист + тактильный предмет + карточка-инструкция) → корзина → оформление.

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
```

Требуется Node.js ≥ 18.17. Прочие команды: `npm run build`, `npm start`, `npm run typecheck`.

## Стек

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Zustand (persist) · Framer Motion. Без бэкенда: все данные лежат в `data/`.

## Структура

```
app/            страницы (лендинг, test, results, catalog, set/[id], cart, checkout, thanks)
components/     ui/ (Button, Card, Input, RadioCard, ProgressBar, Spinner, Toaster, icons),
                layout/ (Header, Footer, PageHeading), landing/, sets/
features/       test/ (TestFlow, matchSets), results/, catalog/ (фильтры), cart/, checkout/
data/           books.ts, sets.ts, questions.ts
store/          cartStore (localStorage), testStore (sessionStorage), toastStore
lib/            форматирование цен, номер заказа, useHydrated, выборки наборов
types/          все TypeScript-типы
```

## Логика подбора

`features/test/matchSets.ts` собирает теги выбранных ответов и считает, сколько тегов каждого набора с ними совпадает. Наборы с совпадением ≥ 2 сортируются по убыванию, берутся первые 3, недостающие места заполняются случайными наборами. При равном счёте порядок случайный.

## Заметки

- Плейлисты — встроенные публичные плейлисты Spotify, временная заглушка.
- Обложки наборов — CSS-градиенты с эмодзи вместо фотографий.
- Оплата имитируется: спиннер на 1,5 с → корзина очищается → `/thanks?order=SBC-XXXXXX`.
