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
- Обложки наборов — фотографии с Unsplash в `public/sets/`, подключены через `next/image`; градиент набора служит подложкой, пока фото грузится.
- Оплата имитируется: спиннер на 1,5 с → корзина очищается → `/thanks?order=SBC-XXXXXX`.

## Фотографии

Обложки взяты с [Unsplash](https://unsplash.com) по [лицензии Unsplash](https://unsplash.com/license): бесплатное использование, в том числе коммерческое, указывать автора не обязательно.

| Набор | Автор | Источник |
|---|---|---|
| Тихая тоска у воды (`set-1`) | Malcolm Lightbody | [unsplash.com/photos/bBbtgyMkHb8](https://unsplash.com/photos/bBbtgyMkHb8) |
| Тропа после дождя (`set-2`) | osborn shiloh | [unsplash.com/photos/-5YU_Dl6mQM](https://unsplash.com/photos/-5YU_Dl6mQM) |
| Тёплый свет в окне (`set-3`) | Ana Markovych | [unsplash.com/photos/uWNxBHCCQs4](https://unsplash.com/photos/uWNxBHCCQs4) |
| Столик у окна (`set-4`) | Toa Heftiba | [unsplash.com/photos/QnUywvDdI1o](https://unsplash.com/photos/QnUywvDdI1o) |
| Снег за стеклом (`set-5`) | Jutta Elisabeth | [unsplash.com/photos/nUmWcosrrM0](https://unsplash.com/photos/nUmWcosrrM0) |
| Туман над крышами (`set-6`) | Fabian Kleiser | [unsplash.com/photos/h05F6pnxedo](https://unsplash.com/photos/h05F6pnxedo) |
| Первое тепло (`set-7`) | Christian Widell | [unsplash.com/photos/qWqj7_h0mxU](https://unsplash.com/photos/qWqj7_h0mxU) |
| Огни после полуночи (`set-8`) | Janusz Maniak | [unsplash.com/photos/Sws6G1nFJ4E](https://unsplash.com/photos/Sws6G1nFJ4E) |
| Пыль и позолота (`set-9`) | Svetlana Gumerova | [unsplash.com/photos/nLC10ws4vEw](https://unsplash.com/photos/nLC10ws4vEw) |
| Воздух на высоте (`set-10`) | Gabriel Oliver | [unsplash.com/photos/ysQqP3ZO9ME](https://unsplash.com/photos/ysQqP3ZO9ME) |
| Капли по подоконнику (`set-11`) | Brendan Sapp | [unsplash.com/photos/igf2Wko-1M8](https://unsplash.com/photos/igf2Wko-1M8) |
| Веранда в июле (`set-12`) | Clay Banks | [unsplash.com/photos/5urBxoebDbQ](https://unsplash.com/photos/5urBxoebDbQ) |
