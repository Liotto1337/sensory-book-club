# Сенсорный книжный клуб — MVP

Подбор книг по сенсорным воспоминаниям: тест из 5 вопросов → 3 атмосферы → набор (книга + аромат + плейлист + тактильный предмет + карточка-инструкция) → корзина → оформление.

## Запуск

```bash
npm install
cp .env.example .env.local   # по желанию: токен DaData для подсказок адреса
npm run dev                  # http://localhost:3000
```

Требуется Node.js ≥ 18.17 (официальная сборка: для better-sqlite3 нужны готовые бинарники; сборка Node из пакетов Ubuntu их не находит). Прочие команды: `npm run build`, `npm start`, `npm run typecheck`.

Переменные окружения (см. `.env.example`):

- `DADATA_API_KEY` — токен [DaData](https://dadata.ru) для подсказок адреса. `.env.local` не хранится в git, поэтому после клонирования ключ нужно добавить заново. Без него поле адреса работает как обычное, а в лог сервера выводится предупреждение.
- `DATABASE_PATH` — путь к файлу SQLite, по умолчанию `.data/sensory-book-club.db`. База и таблицы создаются при первом запросе.

SQLite хранится в файле, поэтому нужен сервер с постоянным диском (VPS, Docker с томом). На serverless-хостингах вроде Vercel файл не сохраняется между запросами — там понадобится облачная БД.

## Стек

Next.js 14 (App Router, Route Handlers) · TypeScript (strict) · Tailwind CSS · Zustand (persist) · Framer Motion · SQLite (better-sqlite3). Каталог наборов статический и лежит в `data/`; пользователи, сессии и отзывы — в SQLite.

## Структура

```
app/            страницы (лендинг, test, results, catalog, set/[id], cart, checkout, thanks, login, register)
app/api/        auth/ (register, login, logout, me), sets/[id]/reviews, address/suggest
components/     ui/ (Button, Card, Input, PhoneInput, RadioCard, ProgressBar, Spinner, Toaster, icons),
                layout/ (Header, UserMenu, ThemeToggle, Footer, PageHeading), landing/, sets/
features/       test/ (TestFlow, matchSets), results/, catalog/ (фильтры), cart/,
                checkout/ (форма, AddressInput), auth/ (AuthForm), reviews/
data/           books.ts, sets.ts, questions.ts
store/          cartStore (localStorage), testStore (sessionStorage), authStore, toastStore
lib/            цены, номер заказа, маска телефона, валидация, тема, выборки наборов
lib/server/     SQLite (db), пароли, сессии, ограничение попыток входа, HTTP-хелперы
types/          все TypeScript-типы
```

## Аккаунты и отзывы

- Регистрация и вход по email и паролю (`/register`, `/login`). Пароли хешируются scrypt из `node:crypto`; сессия — случайный токен в httpOnly-cookie `sbc_session` на 30 дней, в базе хранится только его SHA-256.
- Изменяющие запросы принимаются только со своего Origin (защита от CSRF поверх SameSite=Lax). После 5 неудачных попыток вход по email блокируется на 15 минут.
- На странице набора авторизованный пользователь оставляет один отзыв (оценка 1–5 и текст 10–1000 символов), может изменить или удалить его.

API (`app/api/`):

| Метод и путь | Что делает |
|---|---|
| `POST /api/auth/register` | регистрация, сразу открывает сессию |
| `POST /api/auth/login` · `POST /api/auth/logout` | вход и выход |
| `GET /api/auth/me` | текущий пользователь или `null` |
| `GET /api/sets/:id/reviews` | отзывы набора и средняя оценка |
| `POST /api/sets/:id/reviews` · `DELETE …` | создать или обновить свой отзыв, удалить его |
| `POST /api/address/suggest` | прокси к подсказкам DaData; токен остаётся на сервере |

## Оформление заказа

Телефон вводится по маске `+7 (XXX) XXX-XX-XX`: буквы не набираются, номер можно вставить в любом виде («8 900…», «+7900…»). Адрес подсказывает DaData; если выбрать улицу без дома, подсказки продолжаются до дома.

## Логика подбора

`features/test/matchSets.ts` собирает теги выбранных ответов и считает, сколько тегов каждого набора с ними совпадает. Наборы с совпадением ≥ 2 сортируются по убыванию, берутся первые 3, недостающие места заполняются случайными наборами. При равном счёте порядок случайный.

## Заметки

- Плейлисты — встроенные публичные плейлисты Spotify, временная заглушка.
- Обложки наборов — фотографии с Unsplash в `public/sets/`, подключены через `next/image`; градиент набора служит подложкой, пока фото грузится.
- Тёмная тема: цвета Tailwind заданы CSS-переменными в `app/globals.css` (`:root` и `.dark`). Переключатель в шапке, выбор хранится в `localStorage`; без выбора сайт следует системной теме. Класс `.dark` ставится инлайн-скриптом до отрисовки (`lib/theme.ts`), поэтому страница не мигает.
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
