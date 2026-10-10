# Редизайн «Тёплая редакция» — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** перевести весь сайт на дизайн-систему «Тёплая редакция», пересобрать главную со скролл-эффектами (GSAP, Lenis, React Bits) и добавить ленту настоящих отзывов.

**Architecture:** значения токенов меняются в CSS-переменных, имена остаются прежними, поэтому большая часть разметки подхватывает стиль сама. Общие компоненты (`components/ui`, `components/layout`, `components/sets`) задают геометрию и типографику. Lenis на тикере GSAP синхронизирован со ScrollTrigger. Скролл-эффекты лежат в `components/effects` и отключаются при `prefers-reduced-motion`. Лента отзывов получает данные из нового GET-эндпоинта и рендерится на клиенте, поэтому главная остаётся статической.

**Tech Stack:** Next.js 14 (App Router), TypeScript strict, Tailwind CSS 3.4, Framer Motion 11, GSAP 3.15 (ScrollTrigger, SplitText), @gsap/react 2.1, Lenis 1.3, SQLite (better-sqlite3).

**Spec:** `docs/superpowers/specs/2026-10-10-redesign-warm-editorial-design.md`. Макет: `/home/claude/google_drive/sensory-redesign/b-warm-editorial.html`.

## Global Constraints

- Токены в `app/globals.css` — ровно значения из таблицы спеки (светлая и тёмная), плюс `band`/`on-band`. Текст цвета акцента — только `terracotta-dark`. `terracotta` — фон и декор.
- Шрифты: Sofia Sans Condensed (`--font-display`), Playfair Display курсив (`--font-playfair`), Golos Text (`--font-golos`), JetBrains Mono (`--font-mono`). Все через `next/font/google` с `subsets: ["latin", "cyrillic"]`.
- Без скруглений: `rounded-card` и `rounded-control` = `0px`. `rounded-full` только у точек и звёзд. Тени только у всплывающих элементов.
- Заголовки: класс `.display` (капс, line-height 0.9). Акцент — один `<em>` (Playfair курсив, без капса) на заголовок.
- Tailwind 3.4: никаких классов Tailwind 4 (`bg-linear-*`, `bg-(--x)`, `shadow-xs`, `rounded-xs`, `outline-hidden`, `!` в конце класса).
- `framer-motion@11` остаётся. Пакет `motion` не ставить. Компоненты React Bits переводятся на импорт `framer-motion`.
- GSAP импортируется только из `lib/gsap.ts`. Эффекты создаются в `useGSAP(..., { scope })`, внутри `gsap.matchMedia().add(MOTION_OK, ...)`. ScrollTrigger только на верхнеуровневых tween-ах. `markers` никогда.
- Без WebGL и canvas-фонов. Фото только через `next/image`.
- Файл, основанный на React Bits, начинается строкой `// Основано на React Bits <Имя> (https://reactbits.dev, MIT + Commons Clause), адаптировано`. Перед адаптацией код из реестра (`https://reactbits.dev/r/<Имя>-TS-TW.json`) прочитать целиком.
- Тексты на русском. Функциональность, маршруты, существующие API и схема БД не меняются.
- `cn()` (`lib/cn.ts`) просто склеивает классы без слияния. Не передавайте через `className` утилиты, конфликтующие с классами варианта: для каждого вида кнопки есть свой `variant` и `size`.
- Коммиты: автор `Liotto1337 <egorstep.0801@gmail.com>` (глобальный git config), без строки `Co-Authored-By`, сообщения на английском в повелительном наклонении, как в истории. Не пушить без команды пользователя.

## Стенд проверки

Скрипты проверки лежат вне репозитория: `TOOLS=/tmp/claude-0/-root/2bccfc5d-837f-4d4d-8c7e-316bb20cd5fe/scratchpad/tools`. Там уже установлены `playwright` (с Chromium) и `sharp`. Если папки нет: `mkdir -p $TOOLS && cd $TOOLS && npm init -y && npm i playwright@1 sharp@0.34 && npx playwright install --with-deps chromium`.

- **Сервер:** `npm run build && (DATABASE_PATH=$TOOLS/../verify.db npx next start -p 3123 > $TOOLS/../srv.log 2>&1 &)`. Готовность: `curl -s -o /dev/null -w "%{http_code}" localhost:3123/` вернёт `200`.
- **Остановка сервера:** `kill $(ss -ltnp | sed -n 's/.*:3123 .*pid=\([0-9]*\).*/\1/p')`. Не `pkill -f`: он убивает и собственную оболочку.
- **Скриншоты:** `node $TOOLS/shoot-site.mjs <url> <out.png> <w> <h> <light|dark> [scrollY] [reduce]` — создаётся в задаче 1. Ошибки консоли печатает как `CONSOLE ERROR: ...`. Скриншоты сохранять в `$TOOLS/../shots/<task>/` и смотреть через Read, сравнивая с макетом.
- **Матрица ширин:** 1440×900, 768×1024, 390×844.

## Review Focus

1. **Клиентский переход и возврат «назад».** Эффекты главной продолжают работать, ScrollTrigger пересчитан, ошибок в консоли нет. Проверка: `rf-navigation.mjs`, задача 8.
2. **`prefers-reduced-motion: reduce`.** Весь контент виден сразу: строки заголовка, слова абзаца непрозрачны, счётчики показывают итог, бегущая строка стоит. Проверка: `rf-reduced-motion.mjs`, задача 8.
3. **Длинный пользовательский контент в ленте отзывов.** Текст 1000 символов, слово из 60 букв без пробелов, имя 50 символов: карточка не распирается, текст обрезан с `…`. Проверка: `rf-long-review.mjs`, задача 9.
4. **Мобильное меню.** Фон не скроллится, Esc и переход по ссылке закрывают меню, фокус возвращается на бургер, при расширении окна до десктопа меню закрывается. Проверка: `rf-mobile-menu.mjs`, задача 4.
5. **Повторная разбивка заголовка** (`autoSplit` при ресайзе и загрузке шрифтов). Текст не дублируется, доступное имя `h1` полное. Проверка: `rf-resplit.mjs`, задача 7.

---

### Task 1: Токены, шрифты, базовые стили

**Files:**
- Modify: `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`
- Create (вне репо): `$TOOLS/shoot-site.mjs`. Modify (вне репо): `$TOOLS/contrast.mjs`

**Interfaces:**
- Produces:
  - Tailwind-цвета `band` и `on-band`;
  - семейства `font-display`, `font-serif` (Playfair), `font-sans` (Golos), `font-mono` (JetBrains);
  - CSS-классы `.wrap` (`max-width: 1360px; margin-inline: auto; padding-inline: clamp(16px, 4vw, 48px)`), `.display`, `.display em`, `.label` (mono, 12px, `letter-spacing: .12em`, uppercase, 500), `.split-pending` (см. шаг 3);
  - фиксированное зерно на `body::before`.

- [ ] **Step 1: Скрипт контраста читает токены из файла.** Перепишите `$TOOLS/contrast.mjs`: он парсит `--color-*` из блоков `:root` и `.dark` в `app/globals.css` (путь первым аргументом) и проверяет пары: `ink`, `ink-soft`, `ink-muted` на `cream`; `ink-muted` на `linen` и `sand`; `terracotta-dark` на `cream` и `linen`; `linen` на `terracotta`; `on-band` на `band`. Печатает `FAIL`, если меньше 4.5, и в этом случае завершается с кодом 1.
- [ ] **Step 2: Запустите на текущих токенах.** `node $TOOLS/contrast.mjs app/globals.css`. Ожидается: падение, потому что токена `band` ещё нет, или `FAIL` на старой паре `linen` на `terracotta` (3.5).
- [ ] **Step 3: Обновите `app/globals.css`.**
  - значения из спеки как RGB-каналы, в `:root` и `.dark`, плюс `--color-band` и `--color-on-band`;
  - `body::before` — зерно: `position: fixed; inset: 0; z-index: 100; pointer-events: none`, SVG `feTurbulence` в data-URI, `opacity: .06`, в `.dark` `.05`;
  - в `@layer components` классы `.wrap`, `.display` (`font-family: var(--font-display); font-weight: 500; text-transform: uppercase; line-height: .9`), `.display em` (`font-family: var(--font-playfair); font-style: italic; font-weight: 400; text-transform: none; letter-spacing: 0`), `.label`;
  - `.split-pending`: внутри `@media (prefers-reduced-motion: no-preference)` — `visibility: hidden; animation: split-fallback 0s 2.5s forwards`, `@keyframes split-fallback { to { visibility: visible } }`;
  - в `@layer base`: `:focus-visible { outline: 2px solid rgb(var(--color-terracotta)); outline-offset: 2px }`. Компоненты с собственным `focus-visible:ring-*` ставят `focus-visible:outline-none`.
- [ ] **Step 4: `tailwind.config.ts` и `app/layout.tsx`.**
  - Tailwind: цвета `band` и `on-band` через `token()`; `fontFamily.display = ["var(--font-display)", "Arial Narrow", "sans-serif"]`, `sans` → `var(--font-golos)`, `mono` → `var(--font-mono)`; `borderRadius.card` и `borderRadius.control` = `"0px"`.
  - `layout.tsx`: `Sofia_Sans_Condensed`, `Playfair_Display` (`style: ["normal", "italic"]`), `Golos_Text`, `JetBrains_Mono` — все с `display: "swap"`, переменные на `<html>`; `Inter` удалить; `themeColor` `#F1EADC` / `#15110D`.
- [ ] **Step 5: Проверка контраста.** `node $TOOLS/contrast.mjs app/globals.css`. Ожидается: все строки `AA`, код выхода 0.
- [ ] **Step 6: Скрипт скриншотов `$TOOLS/shoot-site.mjs`.**
  - Через `context.addInitScript` пишет `localStorage["sensory-book-club-theme"] = theme`, чтобы `themeInitScript` поставил `.dark`.
  - `reduce` → `reducedMotion: "reduce"`.
  - Скроллит до `scrollY` шагами по 300 px с паузой 100 мс, ждёт 1500 мс, снимает экран.
  - Печатает `CONSOLE ERROR: <text>` для `console.error` и `pageerror`.
- [ ] **Step 7: Сборка и визуальная проверка.** `npm run typecheck && npm run build`, затем стенд. Снимите `/` и `/catalog` на 1440 в обеих темах. Ожидается: фон — тёплая бумага `#F1EADC`, в тёмной теме `#15110D`; текст набран Golos; углы карточек квадратные; видно лёгкое зерно; `CONSOLE ERROR` нет.
- [ ] **Step 8: Commit.** `git add app/globals.css tailwind.config.ts app/layout.tsx && git commit -m "Switch design tokens, fonts and base styles to warm editorial"`

### Task 2: Базовые UI-компоненты

**Files:**
- Modify: `components/ui/buttonStyles.ts`, `components/ui/Card.tsx`, `components/ui/Input.tsx`, `components/ui/RadioCard.tsx`, `components/ui/ProgressBar.tsx`, `components/ui/Toaster.tsx`, `features/catalog/TagFilter.tsx`, `features/catalog/CatalogView.tsx` (кнопка «Сбросить» → `size="sm"`), `features/reviews/ReviewForm.tsx` (контейнер и textarea), `features/checkout/AddressInput.tsx` (список)
- Create: `components/ui/Tag.tsx`

**Interfaces:**
- Consumes: токены и классы из задачи 1.
- Produces:
  - `type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "band"`;
  - `type ButtonSize = "sm" | "md" | "lg"` — 36 / 46 / 54 px;
  - `buttonClasses(variant?, size?, className?)` — сигнатура прежняя;
  - `Tag({ children, className }: { children: ReactNode; className?: string })`;
  - `Eyebrow({ children, className, onPhoto }: { children: ReactNode; className?: string; onPhoto?: boolean })`.

- [ ] **Step 1: `buttonStyles.ts`.**
  - База: `inline-flex items-center justify-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-300`, кольцо фокуса `terracotta` с `ring-offset-cream`, `disabled:opacity-40`, сдвиг последней иконки при hover `[&>svg:last-child]:transition-transform hover:[&>svg:last-child]:translate-x-1`.
  - Варианты:
    - `primary` — `bg-terracotta text-linen hover:bg-terracotta-dark`;
    - `secondary` — `border border-ink text-ink hover:bg-ink hover:text-cream`;
    - `ghost` — `text-ink underline-offset-4 hover:underline`;
    - `inverse` — `border border-white/70 text-white hover:bg-white hover:text-[#1B1510]`;
    - `band` — `bg-terracotta text-linen hover:bg-terracotta-dark dark:bg-on-band dark:text-band dark:hover:bg-linen`.
  - Размеры: `sm` — `h-9 px-3`, `md` — `h-[46px] px-5`, `lg` — `h-[54px] px-8`.
- [ ] **Step 2: `Tag.tsx`.**
  - `Tag` — `<span>` `inline-flex items-center bg-ink px-2.5 pb-1 pt-1.5 font-mono text-xs font-medium uppercase leading-none tracking-[0.12em] text-cream`.
  - `Eyebrow` — `<p>` класса `.label` с квадратом `h-[9px] w-[9px] bg-terracotta` перед текстом; цвет `text-ink-soft`, при `onPhoto` — `text-white/85`.
- [ ] **Step 3: Карточки, поля, радиокарточки.**
  - `Card`: `border border-ink/15 bg-linen`, при `interactive` — `transition-colors hover:border-ink/40`.
  - `Input` и textarea в `ReviewForm`:
    - подпись `.label text-ink-soft`;
    - поле `border bg-linen`: обычное `border-ink/20 focus:border-ink focus:ring-2 focus:ring-terracotta/30`, с ошибкой `border-terracotta-dark`;
    - текст ошибки `text-terracotta-dark`.
  - Контейнер `ReviewForm`: `border border-ink/15 bg-linen` без тени.
  - `RadioCard`:
    - рамка `border-ink/15 hover:border-ink/40`, выбранная — `border-ink ring-1 ring-ink`;
    - ячейка эмодзи `bg-sand`, у выбранной `bg-terracotta-light`;
    - индикатор — квадрат `h-4 w-4 border`: выбранный `border-terracotta bg-terracotta`, иначе `border-ink/30`.
- [ ] **Step 4: Прогресс, тосты, фильтры, подсказки адреса.**
  - `ProgressBar`: подписи `.label text-ink-muted` «Вопрос {current} / {total}» и «{percent}%», линия `h-0.5 bg-ink/15`, заливка `bg-terracotta`.
  - `Toaster`: без скруглений, иконка в квадрате.
  - `TagFilter`: кнопки `border px-3.5 py-2 font-mono text-xs uppercase tracking-[0.12em]`, активная `border-ink bg-ink text-cream`, неактивная `border-ink/15 bg-linen text-ink-soft hover:border-ink/40 hover:text-ink`.
  - `AddressInput`: у `<ul>` атрибут `data-lenis-prevent` и `border border-ink/15 bg-linen shadow-lifted`.
- [ ] **Step 5: Проверка.** `npm run typecheck && npm run build`, стенд. Скриншоты на 1440 и 390 в обеих темах:
  - `/test` — кнопки, радиокарточки, прогресс;
  - `/login` — поля;
  - `/catalog` — фильтры.

  Ожидается: всё квадратное, кнопки моноширинным капсом, у выбранной радиокарточки тёмная рамка и квадратный терракотовый индикатор, `CONSOLE ERROR` нет.
- [ ] **Step 6: Commit.** `git add components/ui features/catalog features/reviews/ReviewForm.tsx features/checkout/AddressInput.tsx && git commit -m "Restyle buttons, fields, cards and filters"`

### Task 3: Инфраструктура анимаций

**Files:**
- Modify: `package.json`, `package-lock.json`, `app/layout.tsx`, `app/template.tsx`
- Create: `lib/gsap.ts`, `components/motion/SmoothScroll.tsx`, `$TOOLS/check-lenis.mjs`

**Interfaces:**
- Produces:
  - `lib/gsap.ts` (`"use client"`) экспортирует `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP` и `MOTION_OK = "(prefers-reduced-motion: no-preference)"`. `gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)` вызывается под `if (typeof window !== "undefined")`.
  - `SmoothScroll(): JSX.Element`.
  - Глобальный экземпляр Lenis, доступный через `useLenis()` из `lenis/react`.

- [ ] **Step 1: Проверка до изменений.** Напишите `$TOOLS/check-lenis.mjs <baseUrl>`, 1440, печатает три строки:
  - `lenis-class: <bool>` — `document.documentElement.classList.contains("lenis")`;
  - `wheel-scrolled: <bool>` — `window.scrollY > 300` после `page.mouse.wheel(0, 900)` и паузы 1500 мс;
  - `template-transform-none: <bool>` — `getComputedStyle(document.querySelector("main > div")).transform === "none"` (на `/catalog`, после загрузки и паузы 600 мс).

  Плюс `CONSOLE ERROR: …` при ошибках. Запуск на текущей сборке: `lenis-class: false`.
- [ ] **Step 2: Зависимости.** `npm i gsap@^3.15.0 @gsap/react@^2.1.2 lenis@^1.3.26`. Ожидается: в `package.json` три новых пакета, `vue` и `@nuxt/kit` не установлены (`ls node_modules/vue` → нет).
- [ ] **Step 3: `lib/gsap.ts` и `SmoothScroll.tsx`.**
  - `<ReactLenis root options={{ autoRaf: false, anchors: true, stopInertiaOnNavigate: true }} ref={lenisRef} />`.
  - `useEffect`: `const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000); gsap.ticker.add(update); gsap.ticker.lagSmoothing(0);`, в очистке — `gsap.ticker.remove(update)`.
  - `useLenis(() => ScrollTrigger.update())`.
  - При смене `usePathname()`: `requestAnimationFrame(() => ScrollTrigger.refresh())`.
  - Своего `scrollTo` нет.
- [ ] **Step 4: Подключение.** В `app/layout.tsx` добавьте `import "lenis/dist/lenis.css"` перед `./globals.css` и `<SmoothScroll />` первым ребёнком `<body>`. В `app/template.tsx` анимация только `opacity` 0 → 1, 0.35 с.
- [ ] **Step 5: Проверка.** `npm run typecheck && npm run build`, стенд, `node $TOOLS/check-lenis.mjs http://localhost:3123`. Ожидается: три `true`, ни одного `CONSOLE ERROR`. Переход `/` → `/catalog` по ссылке шапки открывает каталог сверху.
- [ ] **Step 6: Commit.** `git add -A package.json package-lock.json lib/gsap.ts components/motion app/layout.tsx app/template.tsx && git commit -m "Add Lenis smooth scroll driven by the GSAP ticker"`

### Task 4: Шапка, мобильное меню, подвал, заголовки страниц

**Files:**
- Modify: `components/layout/Header.tsx`, `components/layout/UserMenu.tsx`, `components/layout/ThemeToggle.tsx`, `components/layout/Footer.tsx`, `components/layout/PageHeading.tsx`
- Create: `components/layout/navLinks.ts`, `components/layout/MobileMenu.tsx`, `$TOOLS/rf-mobile-menu.mjs`

**Interfaces:**
- Consumes: `Tag`, `ButtonLink`; `useLenis` из `lenis/react`; `getSetsByIds` из `lib/sets.ts`; `useAuthStore`.
- Produces:
  - `navLinks: Array<{ href: string; label: string }>` — `[{ href: "/catalog", label: "Каталог" }, { href: "/test", label: "Сенсорный тест" }, { href: "/#how", label: "Как это работает" }]`;
  - `MobileMenu({ open, onClose, returnFocusRef }: { open: boolean; onClose: () => void; returnFocusRef: RefObject<HTMLButtonElement> })`;
  - `PageHeading({ eyebrow, title, description, aside, align = "left" }: { eyebrow?: string; title: ReactNode; description?: ReactNode; aside?: ReactNode; align?: "left" | "center" })`;
  - у `<footer>` атрибут `id="site-footer"`.

- [ ] **Step 1: Проверка мобильного меню (Review Focus 4).** Напишите `$TOOLS/rf-mobile-menu.mjs <baseUrl>`, окно 390×844. Сценарий:
  1. Клик по `button[aria-label="Открыть меню"]` → видим `[role="dialog"][aria-label="Меню"]`, `document.body.style.overflow === "hidden"`, `<html>` имеет класс `lenis-stopped`.
  2. `Escape` → диалога нет, `document.activeElement` — бургер.
  3. Снова открыть, кликнуть ссылку «Каталог» → `location.pathname === "/catalog"`, диалога нет.
  4. Снова открыть, `page.setViewportSize({ width: 1024, height: 800 })` → диалога нет.

  При первом расхождении печатает `FAIL <шаг>` и выходит с кодом 1, иначе `OK`. Запуск на текущей сборке: `FAIL 1`.
- [ ] **Step 2: `Header.tsx`.**
  - `<header className="sticky top-0 z-40 border-b border-ink/15 bg-cream">`, внутри `.wrap` высотой 68 px.
  - Логотип: `<Link href="/" className="display text-xl sm:text-[23px]">Сенсорный <em>книжный</em> клуб</Link>`.
  - От `md` видна навигация `navLinks` (`.label`): подчёркивание растёт через `after:` при hover, активный пункт (`pathname.startsWith(href)` для путей без `#`) — `text-terracotta-dark`.
  - Справа `ThemeToggle`, `UserMenu`, корзина: от `md` `.label` «Корзина [{n}]», ниже `BagIcon` со счётчиком (счёт через `useHydrated`, как сейчас). Кнопка `ButtonLink size="sm"` «Пройти тест» видна от `md` и не на `/test`.
  - Ниже `md` — бургер `aria-label="Открыть меню"` и `aria-expanded`.
- [ ] **Step 3: `MobileMenu.tsx`.** При `open`:
  - `fixed inset-0 z-50 bg-cream`, `role="dialog" aria-modal="true" aria-label="Меню"`, `data-lenis-prevent`;
  - кнопка «Закрыть меню», ссылки `navLinks` классом `display text-5xl`, строка с `ThemeToggle`, «Войти» (`/login`) или «Выйти» (через `useAuthStore().logout`), `ButtonLink` «Пройти тест»;
  - эффекты: `lenis?.stop()` и `document.body.style.overflow = "hidden"` (при закрытии — `lenis?.start()` и сброс), Esc → `onClose`, смена `usePathname()` → `onClose`, `matchMedia("(min-width: 768px)")` при совпадении → `onClose`;
  - фокус на первую ссылку при открытии, на `returnFocusRef` при закрытии.
- [ ] **Step 4: `UserMenu`, `ThemeToggle`, `Footer`, `PageHeading`.**
  - `UserMenu` и `ThemeToggle`: кнопки 40×40 без `rounded-full`, `border border-transparent hover:border-ink/20`; аватар квадратный `bg-terracotta-light font-display`; выпадающее меню `border border-ink/15 bg-linen shadow-lifted`.
  - `Footer` по спеке:
    - `bg-sand`, без верхнего отступа;
    - сетка из трёх колонок с рамками; в колонке «Атмосферы» ссылки `/set/{id}` с названием `atmosphere` для `getSetsByIds(["set-1", "set-2", "set-3", "set-4"])`;
    - «Подписка» и `<span className="text-ink-muted">[ скоро ]</span>` — текстом;
    - гигантское `display whitespace-nowrap text-[clamp(52px,11.2vw,190px)] leading-[.85]` «Сенсорный <em>клуб</em>»;
    - нижняя строка `.label`.
  - `PageHeading`: `Tag` (eyebrow), `<h1 className="display text-[clamp(52px,9vw,104px)]">`, описание `max-w-2xl text-lg text-ink-soft`, `aside` справа внизу `.label text-ink-muted`; при `align="center"` всё по центру, `aside` под описанием.
- [ ] **Step 5: Проверка.**
  - `npm run typecheck && npm run build`, стенд.
  - `node $TOOLS/rf-mobile-menu.mjs http://localhost:3123` → `OK`.
  - Скриншоты `/` (шапка) и низа `/catalog` (подвал) на 1440, 768, 390 в обеих темах. Ожидается: логотип с курсивом «книжный», навигация моноширинным капсом на 1440, бургер на 390, подвал из трёх «коробок» с гигантским словом без горизонтального скролла (`document.documentElement.scrollWidth <= innerWidth`).
- [ ] **Step 6: Commit.** `git add components/layout && git commit -m "Redesign header, footer and page headings, add mobile menu"`

### Task 5: Компоненты наборов

**Files:**
- Modify: `components/sets/SetCover.tsx`, `components/sets/SetCard.tsx`, `components/sets/SensoryDetails.tsx`, `components/sets/SetContents.tsx`, `components/sets/PlaylistEmbed.tsx`, `features/catalog/filterTags.ts`
- Create (вне репо): `$TOOLS/shoot-card-states.mjs`

**Interfaces:**
- Consumes: `placeFilters`, `seasonFilters`.
- Produces:
  - `getSetBadge(set: Pick<SensorySet, "tags">): string` — первая подпись места и первая подпись сезона через `" · "`, например `"Море · Лето"`; отсутствующая часть пропускается;
  - `SetCover({ set, size = "md", sizes, className, imageClassName })`: `size: "md" | "lg" | "thumb"` — `md` `aspect-[1/1.02]`, `lg` `aspect-[4/5]`, `thumb` `h-full`; `imageClassName` добавляется к `<Image>`;
  - `SetCard({ set, showDetails = true })` — вся карточка `<Link href={`/set/${set.id}`}>`;
  - `SensoryDetails({ set, variant = "boxed" })`: `variant: "boxed" | "compact"`.

- [ ] **Step 1: Проверка `getSetBadge` (чистая функция).** `node --input-type=module -e "import assert from 'node:assert/strict'; const m = await import('./features/catalog/filterTags.ts'); assert.equal(m.getSetBadge({ tags: ['sea','summer','evening'] }), 'Море · Лето'); assert.equal(m.getSetBadge({ tags: ['home'] }), 'Дом'); console.log('OK')"`. Ожидается сейчас: ошибка `getSetBadge is not a function`.

  Если импорт падает на `import type` из `@/types`: в `filterTags.ts` такой импорт стрипается Node и проблем не даёт. Иначе перенесите `getSetBadge` в `features/catalog/setBadge.ts`, который импортирует только `./filterTags`, и поправьте путь в команде.
- [ ] **Step 2: Реализуйте `getSetBadge`.** Повторите команду. Ожидается: `OK`.
- [ ] **Step 3: `SetCover` и `SetCard` по спеке.**
  - Обложка без скругления, подложка — градиент набора.
  - `SetCard`:
    - `group flex h-full flex-col border border-ink/15 bg-linen transition-colors hover:border-ink/40`;
    - `imageClassName`: `transition-[filter,transform] duration-700 [@media(hover:hover)]:saturate-[.6] [@media(hover:hover)]:sepia-[.2] [@media(hover:hover)]:group-hover:saturate-100 [@media(hover:hover)]:group-hover:sepia-0 group-hover:scale-105`;
    - поверх фото: плашка `getSetBadge` (`.label bg-black/35 px-2 py-1 text-white backdrop-blur`) слева сверху, `↗` справа сверху (сдвиг при hover);
    - подпись: `h3` `text-2xl font-medium tracking-tight` — `atmosphere`, цена `font-display text-2xl`, `.label text-ink-muted` — `scent`, при `showDetails` — `SensoryDetails variant="compact"`.
- [ ] **Step 4: `SensoryDetails`, `SetContents`, `PlaylistEmbed`.**
  - `SensoryDetails`: `boxed` — `<dl>` в рамке `divide-y divide-ink/15`, строки `grid grid-cols-[120px_1fr] px-5 py-4`, `dt` `.label text-ink-muted`; `compact` — строки без рамки, `dt` `.label`, `dd` `text-sm text-ink-soft`. Эмодзи убрать.
  - `SetContents`: `<ol>` строками `grid grid-cols-[48px_1fr] border-b border-ink/15 py-4`, номер `.label text-ink-muted` `01`–`05`. Пункты прежние, без эмодзи.
  - `PlaylistEmbed`: `border border-ink/15` вместо скругления.
- [ ] **Step 5: Проверка.**
  - `npm run typecheck && npm run build`, стенд.
  - Скриншоты `/catalog` на 1440 и 390 в обеих темах и `/` с прокруткой до примеров наборов.
  - `$TOOLS/shoot-card-states.mjs <baseUrl> <outDir>` снимает `/catalog` дважды: десктоп 1440 с `page.hover` на первом `a[href^="/set/"]` и контекст `isMobile: true, hasTouch: true` 390×844. Печатает вычисленный `filter` первого изображения в обоих случаях.

  Ожидается: фото приглушены и цветные при наведении (`filter` при hover без `saturate(0.6)`); на тач-устройстве `filter` — `none`, фото цветные сразу; плашка «Море · Лето»; стрелка ↗; кнопки «Подробнее» нет; у карточки виден фокус при Tab.
- [ ] **Step 6: Commit.** `git add components/sets features/catalog/filterTags.ts && git commit -m "Redesign set cards, covers and set details"`

### Task 6: API последних отзывов

**Files:**
- Modify: `types/index.ts`
- Create: `lib/server/reviews.ts`, `app/api/reviews/latest/route.ts`

**Interfaces:**
- Consumes: `getDb()` из `lib/server/db.ts`.
- Produces:
  - `interface LatestReview { id: number; setId: string; rating: number; text: string; authorName: string; createdAt: number }` в `types/index.ts`;
  - `getLatestReviews(limit = 10): LatestReview[]` — SQL из спеки, `LIMIT ?`;
  - `GET /api/reviews/latest` → `{ reviews: LatestReview[] }` с заголовком `Cache-Control: no-store`.

- [ ] **Step 1: Проверка до реализации.** Стенд с новой временной БД: `rm -f $TOOLS/../verify.db*`, затем `curl -s -o /dev/null -w "%{http_code}" localhost:3123/api/reviews/latest`. Ожидается: `404`.
- [ ] **Step 2: Реализуйте `getLatestReviews` и маршрут.** `export const runtime = "nodejs"; export const dynamic = "force-dynamic";`. Маппинг snake_case → camelCase — как в `app/api/sets/[id]/reviews/route.ts`.
- [ ] **Step 3: Пустая база.** Пересоберите, перезапустите стенд. `curl -s localhost:3123/api/reviews/latest`. Ожидается: `{"reviews":[]}`, а `curl -sI` показывает `cache-control: no-store`.
- [ ] **Step 4: Наполнение.** Через публичные API: зарегистрируйте `a@example.com` и `b@example.com` (`POST /api/auth/register`, cookie-jar `-c`) и опубликуйте отзывы (`POST /api/sets/<id>/reviews`). Пользователь A: `set-1` — 5, `set-2` — 3. Пользователь B: `set-3` — 4. Затем прямой вставкой добавьте отзыв на несуществующий набор:

  ```bash
  node -e "const D=require('better-sqlite3');const db=new D(process.argv[1]);const u=db.prepare('SELECT id FROM users LIMIT 1').get().id;const now=Date.now();db.prepare('INSERT INTO reviews (set_id,user_id,rating,text,created_at,updated_at) VALUES (?,?,?,?,?,?)').run('set-999',u,5,'Отзыв на снятый набор',now,now)" $TOOLS/../verify.db
  ```

  Затем `curl -s localhost:3123/api/reviews/latest`. Ожидается: три отзыва по убыванию `createdAt` — `set-999`, `set-3`, `set-1`; отзыва с оценкой 3 нет.
- [ ] **Step 5: Лимит.** Тем же способом (`node -e` с `better-sqlite3`) вставьте 10 пользователей (`email` `u1@example.com`…`u10@example.com`, `name` `Читатель N`, `password_hash` `'x'`) и по отзыву каждого с оценкой 5 на `set-4` с разными `created_at`. На одного пользователя приходится один отзыв на набор: `UNIQUE (set_id, user_id)`. `curl -s localhost:3123/api/reviews/latest | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).reviews.length))"`. Ожидается: `10`.
- [ ] **Step 6: Commit.** `git add types/index.ts lib/server/reviews.ts app/api/reviews && git commit -m "Add endpoint for latest positive reviews"`

### Task 7: Главная, часть 1 — первый экран, ароматы, «что внутри», цифры

**Files:**
- Create: `components/effects/SplitHeading.tsx`, `components/effects/Parallax.tsx`, `components/effects/ScrollVelocity.tsx`, `components/effects/CountUp.tsx`, `components/effects/RevealText.tsx`, `components/landing/ScentMarquee.tsx`, `components/landing/Intro.tsx`, `components/landing/Stats.tsx`, `$TOOLS/rf-resplit.mjs`
- Modify: `components/landing/Hero.tsx`, `app/page.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP`, `MOTION_OK` из `lib/gsap.ts`; `Tag`, `Eyebrow`, `ButtonLink`; `questions`, `sets`; `pluralize`.
- Produces (все `"use client"`):
  - `SplitHeading({ as = "h2", className, children, delay = 0 }: { as?: "h1" | "h2"; className?: string; children: ReactNode; delay?: number })`;
  - `Parallax({ src, alt, sizes, priority = false, strength = 0.15, className }: { src: string; alt: string; sizes: string; priority?: boolean; strength?: number; className?: string })`;
  - `ScrollVelocity({ items, baseVelocity = 60, className }: { items: string[]; baseVelocity?: number; className?: string })`;
  - `CountUp({ to, from = 0, duration = 1.4, className }: { to: number; from?: number; duration?: number; className?: string })`;
  - `RevealText({ children, className }: { children: string; className?: string })`;
  - у `<section>` первого экрана `id="hero"`.

- [ ] **Step 1: Проверка повторной разбивки (Review Focus 5).** Напишите `$TOOLS/rf-resplit.mjs <baseUrl>`:
  1. Открыть `/` на 1440, подождать 2500 мс.
  2. `h1` в `#hero`: `getAttribute("aria-label")`, а если атрибута нет — нормализованный `textContent`, должен быть равен `"Книга, которая пахнет твоим воспоминанием"`.
  3. Нормализованный `textContent` `h1` равен той же строке (без дублей), внутри ровно один `em` с текстом `пахнет`. Если SplitText разрезает `em` по строкам, то все `em` вместе дают `пахнет`.
  4. Ресайз до 390×844, пауза 1500 мс, повтор пунктов 2–3. Ресайз обратно до 1440, повтор.

  Печатает `OK` или `FAIL <пункт>`. На текущей сборке: `FAIL 2`, потому что заголовок другой.
- [ ] **Step 2: Прочитайте код React Bits** `SplitText-TS-TW`, `ScrollVelocity-TS-TW`, `CountUp-TS-TW`, `ScrollReveal-TS-TW` целиком (`curl -fsSL https://reactbits.dev/r/<Имя>-TS-TW.json`, поле `files[].content`). Адаптируйте по Global Constraints.
- [ ] **Step 3: `SplitHeading`.**
  - Рендерит тег `as` с классом `split-pending`.
  - В `useGSAP` с `scope`: `const mm = gsap.matchMedia(); mm.add(MOTION_OK, () => { SplitText.create(el, { type: "lines", mask: "lines", autoSplit: true, onSplit(self) { el.classList.remove("split-pending"); return gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: 0.12, delay }); } }); }); return () => mm.revert();`.
  - Вне `MOTION_OK` (`mm.add("(prefers-reduced-motion: reduce)", ...)`) только снимает `split-pending`.
  - `aria` SplitText по умолчанию (`"auto"`).
- [ ] **Step 4: `Parallax`, `ScrollVelocity`, `CountUp`, `RevealText`.**
  - `Parallax`:
    - обёртка `relative overflow-hidden`, внутри `absolute inset-x-0 -inset-y-[15%]` с `<Image fill className="object-cover">`;
    - анимация в `MOTION_OK`: `gsap.fromTo(inner, { yPercent: -strength * 50 }, { yPercent: strength * 50, ease: "none", scrollTrigger: { trigger: wrapper, start: "top bottom", end: "bottom top", scrub: true } })`.
  - `ScrollVelocity` — по React Bits, одна строка:
    - элементы разделены `<span className="text-terracotta">✦</span>`, копии кроме первой с `aria-hidden`;
    - при `useReducedMotion()` из `framer-motion` строка статична.
  - `CountUp`:
    - SSR-разметка показывает `to`;
    - если движение разрешено, при монтировании выставляет `from` и анимирует при входе в зону видимости (`useInView`, `once`);
    - формат `Intl.NumberFormat("ru-RU")`.
  - `RevealText`:
    - рендерит `<p>`, слова в `<span className="reveal-word">` при рендере;
    - в `MOTION_OK`: `gsap.fromTo(words, { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 0.05, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } })`.
- [ ] **Step 5: Секции.**
  - **`Hero`** (`id="hero"`):
    - `relative flex h-[calc(100svh-68px)] min-h-[600px] max-h-[980px] items-end overflow-hidden bg-[#111] text-white`;
    - `Parallax` с `/sets/set-3.jpg`, `alt="Свечи, открытые книги и вязаный плед у окна"`, `priority`, `sizes="100vw"`, `strength={0.12}`;
    - затемнение `bg-gradient-to-t from-black/70 via-black/25 to-black/5` и виньетка `radial-gradient`;
    - в `.wrap` с `pb-[clamp(36px,7vh,80px)]`:
      - `Eyebrow onPhoto` «Сенсорный тест · 5 вопросов · меньше минуты»;
      - `SplitHeading as="h1" className="display mt-6 max-w-[7.2em] text-[clamp(46px,8.4vw,132px)]"`: `Книга, которая <em>пахнет</em> твоим воспоминанием`;
      - строка с подзаголовком (`max-w-[460px] text-white/85`, текст из макета) и кнопками `ButtonLink size="lg"` «Пройти тест» + `ArrowRightIcon` и `variant="inverse"` «Смотреть каталог».
  - **`ScentMarquee`**: `ScrollVelocity items={[...new Set(sets.map((s) => s.scent))]}` в полосе `border-b border-ink/15 py-6`, текст `display text-[clamp(28px,3.4vw,46px)]`.
  - **`Intro`**:
    - `.wrap grid gap-12 pb-[clamp(64px,8vw,110px)] pt-[clamp(96px,14vw,180px)] lg:grid-cols-[5fr_7fr]`;
    - слева `Tag` «Что внутри» и `h2.display text-[clamp(38px,5.8vw,88px)]` `Что такое <em>сенсорный</em> набор?`;
    - справа `RevealText className="font-serif text-[clamp(28px,3.3vw,50px)] leading-[1.16]"` с текстом из макета: «Это книга, подобранная не по жанру, а по ощущению. Аромат, плейлист и предмет, который можно держать в руках, возвращают вас туда, где вы читали лучшую книгу в жизни. Остаётся открыть первую страницу.».
  - **`Stats`** — три «коробки» `flex items-center gap-5 border border-ink/15 bg-sand p-7`:
    - `CountUp className="display text-[clamp(64px,6.4vw,96px)]"`;
    - заголовок `text-lg font-medium uppercase` — `pluralize(questions.length, ["вопрос", "вопроса", "вопросов"]) + " в тесте"`, `pluralize(sets.length, ["атмосфера", "атмосферы", "атмосфер"])`, «чувства в наборе» (константа 4);
    - подписи `text-ink-muted`: «Меньше минуты на подбор», «От пустого пляжа до снега за стеклом», «Запах, звук, касание и слово».
  - **`app/page.tsx`**: порядок `Hero`, `ScentMarquee`, `Intro`, `Stats`, `HowItWorks`, `FeaturedSets`. Последние два обновляются в задаче 8.
- [ ] **Step 6: Проверка.**
  - `npm run typecheck && npm run build`, стенд.
  - `node $TOOLS/rf-resplit.mjs http://localhost:3123` → `OK`.
  - Скриншоты `/` на 1440 и 390 в обеих темах: `scrollY` 0, на середине `Intro` и на `Stats`.

  Ожидается: заголовок в три строки, «пахнет» курсивом; абзац частично проявлен в середине прокрутки; цифры 5 / 12 / 4 после входа в экран; горизонтального скролла нет; `CONSOLE ERROR` нет.
- [ ] **Step 7: Commit.** `git add components/effects components/landing app/page.tsx && git commit -m "Rebuild landing hero, scent marquee, intro and stats with scroll effects"`

### Task 8: Главная, часть 2 — шаги, наборы, лозунг, призыв, нижняя кнопка

**Files:**
- Create: `components/effects/FadeUp.tsx`, `components/landing/Statement.tsx`, `components/landing/CtaBand.tsx`, `components/landing/MobileTestCta.tsx`, `$TOOLS/rf-navigation.mjs`, `$TOOLS/rf-reduced-motion.mjs`
- Modify: `components/landing/HowItWorks.tsx`, `components/landing/FeaturedSets.tsx`, `app/page.tsx`, `components/ui/icons.tsx` (удалить `MemoryIcon`, `SparkIcon`, `BoxIcon`, `BookIcon`, если `grep -rn` не находит других использований)

**Interfaces:**
- Consumes: `Parallax`, `RevealText`, `CountUp`, `SplitHeading`, `ScrollVelocity` (задача 7); `SetCard` (задача 5); `Tag`; `ButtonLink` с `variant="band"`.
- Produces:
  - `FadeUp({ children, className, stagger = 0.12 }: { children: ReactNode; className?: string; stagger?: number })` — анимирует прямых детей: `y: 32 → 0`, `opacity: 0 → 1`, `duration: 0.8`, `ease: "power3.out"`, `scrollTrigger: { trigger, start: "top 85%", once: true }`, в `MOTION_OK`;
  - у `HowItWorks` `id="how"`, у `CtaBand` `id="cta-band"`.

- [ ] **Step 1: Проверки Review Focus 1 и 2.**
  - `$TOOLS/rf-navigation.mjs <baseUrl>`, 1440:
    1. Открыть `/`, проскроллить до `#how`. У последнего `.reveal-word` `opacity` ≥ 0.99.
    2. Клик «Весь каталог» → `/catalog`, затем `page.goBack()`, пауза 1500 мс.
    3. Проскроллить к `#hero`, затем снова до `#how`, повторить проверку прозрачности.
    4. Ошибок консоли нет.

    Печатает `OK` или `FAIL <пункт>`.
  - `$TOOLS/rf-reduced-motion.mjs <baseUrl>` с `reducedMotion: "reduce"`:
    1. У `#hero h1` `visibility: visible`, класса `split-pending` нет.
    2. У всех `.reveal-word` `opacity` = 1 без прокрутки.
    3. Счётчики в `Stats` показывают `5`, `12`, `4` без прокрутки к ним.
    4. Трансформация бегущей строки не меняется за 1000 мс.

    Печатает `OK` или `FAIL <пункт>`.

  Запуск на текущей сборке: в `rf-navigation` `FAIL 1` (нет `#how`).
- [ ] **Step 2: `FadeUp`, `HowItWorks`, `FeaturedSets`.**
  - **`HowItWorks`**:
    - `id="how"`, `Tag` «Как это работает», `h2` `От воспоминания <em>до книги</em>` по центру;
    - `ol` `grid border-l border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4`, шаги `border-b border-r border-ink/15 p-7 min-h-[260px] hover:bg-sand`;
    - `.label text-ink-muted` «01 / Тест», «02 / Подбор», «03 / Набор», «04 / Чтение»; `h3 mt-16 text-[26px] font-medium`; прежние тексты; иконки убрать;
    - обёртка `FadeUp`.
  - **`FeaturedSets`**: в шапке `Tag` «Примеры наборов», `h2` `Двенадцать <em>атмосфер</em>` и справа `ButtonLink variant="ghost"` «Весь каталог →»; сетка трёх `SetCard` в `FadeUp`.
- [ ] **Step 3: `Statement`, `CtaBand`, `MobileTestCta`, `app/page.tsx`.**
  - **`Statement`**: `relative flex h-[86vh] min-h-[520px] items-center justify-center overflow-hidden bg-[#111] text-white`, `Parallax` `/sets/set-2.jpg` (`strength={0.2}`, `alt=""`), слой `bg-black/40`, `p.display text-center text-[clamp(48px,9vw,150px)]` `Запах. Звук. <em>Страница.</em>`.
  - **`CtaBand`** (`id="cta-band"`):
    - `bg-band text-on-band`, `.wrap flex flex-wrap justify-between gap-10 py-[clamp(72px,9vw,120px)]`;
    - `h2.display` `Готовы<br /><em>вспомнить?</em>`;
    - справа `max-w-[380px]`: текст «Пять вопросов — и три атмосферы, которые совпадут с вашим воспоминанием.», `ButtonLink variant="band" size="lg" className="w-full"` «Пройти сенсорный тест» + `ArrowRightIcon`, ссылка `.label underline underline-offset-4` «или выбрать в каталоге» → `/catalog`.
  - **`MobileTestCta`**:
    - `fixed inset-x-3 bottom-3 z-30 sm:hidden`, `ButtonLink size="lg" className="w-full"` → `/test`;
    - `IntersectionObserver` на `#hero`, `#cta-band`, `#site-footer`: видна, когда ни один не пересекается;
    - скрытие через `translate-y-[150%] opacity-0` с переходом 300 мс и `aria-hidden` / `tabIndex={-1}`, пока скрыта.
  - **`app/page.tsx`**: `Hero`, `ScentMarquee`, `Intro`, `Stats`, `HowItWorks`, `FeaturedSets`, `Statement`, `CtaBand`, `MobileTestCta`.
- [ ] **Step 4: Проверка.**
  - `npm run typecheck && npm run build`, стенд.
  - `rf-navigation.mjs` и `rf-reduced-motion.mjs` → `OK`, `OK`.
  - Скриншоты `/` целиком (по экранам) на 1440 и 390 в обеих темах.
  - На 390 после прокрутки ниже первого экрана видна нижняя кнопка, на `CtaBand` и подвале её нет.

  Ожидается: совпадение с макетом B по секциям; в тёмной теме полоса-призыв терракотовая с тёмной кнопкой; `CONSOLE ERROR` нет.
- [ ] **Step 5: Commit.** `git add -A components app/page.tsx && git commit -m "Add how-it-works grid, statement, call-to-action band and mobile test button"`

### Task 9: Лента отзывов на главной

**Files:**
- Create: `features/reviews/truncate.ts`, `features/reviews/ReviewsRibbon.tsx`, `$TOOLS/rf-long-review.mjs`
- Modify: `app/page.tsx` (вставить `ReviewsRibbon` между `FeaturedSets` и `Statement`)

**Interfaces:**
- Consumes: `GET /api/reviews/latest` и `LatestReview` (задача 6); `requestJson` (`lib/api.ts`); `getSetById` (`lib/sets.ts`); `StarRating`; `Tag`; `SetCover` не нужен — фон карточки `next/image` с `set.image.src`.
- Produces:
  - `truncateAtWord(text: string, max: number): string` — без изменений, если `text.length <= max`. Иначе обрезка до последнего пробела не дальше `max` (если пробела нет — жёстко по `max`), удаление хвостовых знаков препинания `,;:—-` и пробелов, добавление `…`;
  - `ReviewsRibbon(): JSX.Element | null`.

- [ ] **Step 1: Проверка `truncateAtWord`.** `node --input-type=module -e "import assert from 'node:assert/strict'; const { truncateAtWord: t } = await import('./features/reviews/truncate.ts'); assert.equal(t('коротко', 220), 'коротко'); assert.equal(t('раз два, три четыре', 12), 'раз два…'); assert.equal(t('а'.repeat(30), 10), 'а'.repeat(10) + '…'); console.log('OK')"`. Ожидается сейчас: `ERR_MODULE_NOT_FOUND`.
- [ ] **Step 2: Реализуйте `truncateAtWord`.** Повторите команду. Ожидается: `OK`.
- [ ] **Step 3: `ReviewsRibbon`.**
  - Загрузка в `useEffect`, фильтр `getSetById(review.setId)`. Меньше 3, ошибка или загрузка → `null`.
  - Секция `.wrap py-[clamp(96px,12vw,160px)]`: `Tag` «Читатели о наборах», `h2.display` `Ощущения <em>вслух</em>`, справа кнопки `Button variant="secondary" size="sm"` «←» и «→» (`aria-label` «Предыдущие отзывы» и «Следующие отзывы»). Они прокручивают `ul` на ширину карточки плюс зазор через `scrollBy({ behavior: "smooth" })`. На краях `disabled`, по событию `scroll`.
  - `ul`: `flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none]`, `data-lenis-prevent-horizontal`.
  - Карточка `li`: `relative flex w-[min(400px,85vw)] shrink-0 snap-start flex-col justify-end overflow-hidden border border-ink/15 p-7 min-h-[360px]`:
    - чётные — фото набора (`fill`, `sizes="400px"`) с `bg-black/55` и белым текстом, нечётные — `bg-sand`;
    - внутри `“` (`font-serif text-5xl`), текст `truncateAtWord(text, 220)` с `break-words`, имя `font-medium truncate`, `StarRating`, ссылка `.label` на `/set/{setId}` с `atmosphere`.
- [ ] **Step 4: Проверка длинного контента (Review Focus 3).** Напишите `$TOOLS/rf-long-review.mjs <baseUrl> <dbPath>`:
  1. Через `better-sqlite3` из `node_modules` проекта (`createRequire` с путём к проекту) создаёт пользователя с именем из 50 символов и 3 отзыва с оценкой 5 на `set-5`, `set-6`, `set-7` с самыми свежими `created_at`. Один из них — 1000 символов со словом из 60 букв без пробелов.
  2. Открывает `/` на 390×844 и прокручивает до ленты.
  3. Для каждой карточки `scrollWidth <= clientWidth + 1`, текст длинного отзыва заканчивается на `…`, `document.documentElement.scrollWidth <= innerWidth`.

  Печатает `OK` или `FAIL <пункт>`.
- [ ] **Step 5: Проверка.**
  - `npm run typecheck && npm run build`, стенд с чистой БД: ленты нет — `section` с заголовком «Ощущения вслух» отсутствует.
  - Наполните как в задаче 6, шаги 4–5. На 1440 в обеих темах лента есть, отзыв `set-999` не показан, кнопки «←» и «→» листают.
  - `node $TOOLS/rf-long-review.mjs http://localhost:3123 $TOOLS/../verify.db` → `OK`.
- [ ] **Step 6: Commit.** `git add features/reviews app/page.tsx && git commit -m "Show a ribbon of latest reviews on the landing page"`

### Task 10: Каталог, тест, результаты

**Files:**
- Modify: `app/catalog/page.tsx`, `features/catalog/CatalogView.tsx`, `features/test/TestFlow.tsx`, `features/test/QuestionStep.tsx`, `features/results/ResultsView.tsx`

**Interfaces:**
- Consumes: `PageHeading` с `title: ReactNode`, `aside`, `align` (задача 4); `SetCard` (задача 5); `pluralize`.

- [ ] **Step 1: Каталог.**
  - Страница: `section.wrap py-12 sm:py-16`, `PageHeading eyebrow="Каталог" title={<>Все <em>атмосферы</em></>} description=<прежний текст> aside={`${n} ${pluralize(n, ["набор", "набора", "наборов"])}`}`.
  - `CatalogView`:
    - фильтры в `border border-ink/15 bg-linen p-4 sm:p-5`; на `lg` группы «Место» и «Сезон» в одну строку с вертикальным разделителем, подписи групп `.label text-ink-muted`;
    - строка «Найдено: n» `.label` и «Сбросить» `ghost sm`;
    - сетка `mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3`, анимация фильтрации прежняя.
- [ ] **Step 2: Тест и результаты.**
  - `QuestionStep`: заголовок `display text-[clamp(36px,5vw,64px)]` по центру, подзаголовок `text-ink-muted`.
  - `TestFlow`: контейнер `max-w-4xl`, прочее прежнее.
  - `ResultsView`: `PageHeading align="center" eyebrow="Ваш подбор" title={<>Три <em>атмосферы</em> для вас</>}` (описание прежнее), кнопки `secondary` и `ghost`; пустое состояние — `align="center"`, `title={<>Сначала <em>вспомним</em> вместе</>}`.
- [ ] **Step 3: Проверка.**
  - `npm run typecheck && npm run build`, стенд.
  - `$TOOLS/flow-test.mjs <baseUrl> <outDir>`: проходит тест (на каждом шаге первый вариант, затем «Далее» / «Подобрать атмосферу»), проверяет `location.pathname === "/results"` и наличие трёх `a[href^="/set/"]`, сохраняет скриншот результатов. Печатает `OK` или `FAIL <шаг>`.
  - Скриншоты `/catalog` (с фильтром «Море»), `/test` (шаг 1), `/results` на 1440 и 390 в обеих темах.

  Ожидается: фильтр сужает список и «Сбросить» возвращает 12; у результатов три карточки с деталями; `CONSOLE ERROR` нет.
- [ ] **Step 4: Commit.** `git commit -am "Restyle catalog, sensory test and results"`

### Task 11: Страница набора и отзывы

**Files:**
- Modify: `app/set/[id]/page.tsx`, `features/reviews/ReviewsSection.tsx`, `features/cart/AddToCartButton.tsx` (иконку `BagIcon` можно оставить)

**Interfaces:**
- Consumes: `SetCover size="lg"`, `SensoryDetails variant="boxed"`, `SetContents`, `PlaylistEmbed`, `Eyebrow`.

- [ ] **Step 1: Разметка страницы.**
  - `article.wrap py-8 sm:py-12`; ссылка «← Все наборы» `.label`; сетка `mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14`.
  - Левая колонка `lg:sticky lg:top-[92px] lg:self-start`: `SetCover size="lg"` и `PlaylistEmbed`.
  - Правая колонка:
    - `Eyebrow` (`atmosphere`);
    - `h1 font-serif italic text-[clamp(40px,5vw,72px)] leading-[1.02]` (название книги);
    - `.label text-ink-muted` «{author} · {year}»;
    - описание `text-xl text-ink-soft`, аннотация `text-ink-muted`;
    - `SensoryDetails variant="boxed"`;
    - блок цены `flex flex-col gap-4 border border-ink/15 bg-linen p-5 sm:flex-row sm:items-end sm:justify-between`: `.label` «Стоимость набора» и `font-display text-[56px] leading-none` цена, справа `AddToCartButton`;
    - `h2.display text-4xl` «Что входит» и `SetContents`.
- [ ] **Step 2: `ReviewsSection`.**
  - Заголовок `h2.display text-[clamp(38px,5vw,64px)]` «Отзывы».
  - Сводка: `StarRating`, среднее `font-display text-2xl`, количество `.label`.
  - Элементы `border border-ink/15 bg-linen p-5` без тени, аватар квадратный, дата и «изменён» `.label text-ink-muted`.
  - Блоки гостя и «вы уже оставили отзыв» — в рамке без тени. Пустое состояние — пунктирная рамка без скругления.
- [ ] **Step 3: Проверка.**
  - `npm run typecheck && npm run build`, стенд.
  - Скриншоты `/set/set-1` на 1440 (`scrollY` 0 и 900 — обложка прилипла) и на 390 в обеих темах.
  - `$TOOLS/flow-review.mjs <baseUrl>`: регистрирует нового пользователя через форму `/register?next=/set/set-1`, ставит 5 звёзд, пишет отзыв из 20+ символов, «Опубликовать» → отзыв с пометкой «ваш отзыв» в списке; «Изменить» → «Сохранить»; «Удалить» (принимает `window.confirm`) → отзыва нет. Печатает `OK` или `FAIL <шаг>`.

  Ожидается: тосты появляются, отзыв виден в списке и в ленте на главной, если отзывов с оценкой 4–5 не меньше трёх.
- [ ] **Step 4: Commit.** `git commit -am "Redesign set page and reviews section"`

### Task 12: Корзина, оформление, вход, «спасибо», 404

**Files:**
- Modify: `features/cart/CartView.tsx`, `features/cart/CartItemRow.tsx`, `features/checkout/CheckoutView.tsx`, `features/checkout/CheckoutForm.tsx` (только классы), `features/checkout/OrderSummary.tsx`, `features/auth/AuthForm.tsx`, `features/checkout/ThanksContent.tsx`, `app/not-found.tsx`

**Interfaces:**
- Consumes: `PageHeading`, `Tag`, `SetCover size="thumb"`, `buttonClasses`.

- [ ] **Step 1: Корзина и оформление.**
  - `CartView`:
    - заголовок `h1.display text-[clamp(44px,7vw,88px)]` «Корзина»;
    - пустое состояние без 🕯️: `PageHeading align="center" title={<>Корзина пока <em>пуста</em></>}` с прежним описанием и двумя кнопками;
    - блок итога `border border-ink/15 bg-linen p-6`, сумма `font-display text-4xl`.
  - `CartItemRow`: `border border-ink/15 bg-linen p-3 sm:p-4`, `SetCover size="thumb"`, кнопки количества квадратные 32 px в рамке.
  - `CheckoutView`: `h1.display` `Оформление <em>заказа</em>`, форма `border border-ink/15 bg-linen p-5 sm:p-8`, пустое состояние — `PageHeading align="center"`.
  - `OrderSummary`: в рамке, итог `font-display text-3xl`.
- [ ] **Step 2: Вход, «спасибо», 404.**
  - `AuthForm`: карточка `border border-ink/15 bg-linen p-6 sm:p-8`, `h1.display text-5xl`, ошибка формы `bg-terracotta-light text-terracotta-dark` без скругления.
  - `ThanksContent` без 🕊️:
    - `h1.display text-[clamp(64px,12vw,160px)]` `Спасибо <em>за заказ</em>`;
    - текст «Мы свяжемся с вами в течение дня. Уже начали собирать ваш набор: подбираем аромат и завязываем ленту.»;
    - при `orderNumber` — `Tag` «Заказ {orderNumber}», затем `ButtonLink size="lg"` «На главную».
  - `not-found.tsx`: `p.display text-[clamp(120px,20vw,200px)] text-terracotta` «404», `h1` `text-2xl font-medium` «Эта страница затерялась между строк», прежнее описание, `ButtonLink` «В каталог» и `variant="secondary"` «Пройти тест».
- [ ] **Step 3: Проверка.**
  - `npm run typecheck && npm run build`, стенд.
  - `$TOOLS/flow-checkout.mjs <baseUrl> <outDir>`: «В корзину» на `/set/set-1`, `/cart` (+1, −1), `/checkout`: имя `Анна`, телефон `9001234567`, email `anna@example.com`, адрес `Москва, ул. Тверская, д. 1`, «Оплатить» → `location.href` содержит `/thanks?order=SBC-`, счётчик корзины в шапке пуст. Скриншот на каждом шаге, печатает `OK` или `FAIL <шаг>`.
  - Скриншоты каждого шага, `/login`, `/register`, `/nope` (404) на 1440 и 390 в обеих темах.

  Ожидается: сценарий проходит как раньше (корзина очищается, номер заказа показан), `CONSOLE ERROR` нет.
- [ ] **Step 4: Commit.** `git commit -am "Restyle cart, checkout, auth, thank-you and 404 pages"`

### Task 13: README и финальная проверка

**Files:**
- Modify: `README.md`

- [ ] **Step 1: README.**
  - **Стек:** GSAP + ScrollTrigger + SplitText, Lenis, шрифты.
  - **Структура:** `components/effects`, `components/motion`, `components/landing` (обновлённый список), `features/reviews/ReviewsRibbon`.
  - **API:** строка `GET /api/reviews/latest` — до 10 свежих отзывов с оценкой 4–5.
  - **Новый раздел «Анимации»:** Lenis на тикере GSAP, ScrollTrigger, `prefers-reduced-motion`, Framer Motion для анимаций интерфейса.
  - **Заметки:**
    - тёмная тема — токены `band`/`on-band`;
    - атрибуция React Bits (MIT + Commons Clause, какие компоненты адаптированы).
- [ ] **Step 2: Полная матрица.**
  - `npm run typecheck && npm run build`.
  - `node $TOOLS/contrast.mjs app/globals.css` → все `AA`.
  - Стенд с чистой БД, затем наполнение для ленты.
  - Скриншоты всех маршрутов из раздела «Проверка» спеки на 1440, 768, 390 в обеих темах плюс `/` с `reduce`.
  - Все пять `rf-*.mjs` → `OK`.

  Ожидается: ни одного `CONSOLE ERROR`, ни на одном скриншоте нет горизонтального скролла и обрезанного текста.
- [ ] **Step 3: Ручной сценарий из спеки** (тест → набор → корзина → «спасибо»; регистрация → отзыв → лента; мобильное меню; «назад» и «вперёд»). Замечания исправить в соответствующих файлах и повторить шаг 2.
- [ ] **Step 4: Commit.** `git commit -am "Document the redesign, animations and reviews ribbon"`
