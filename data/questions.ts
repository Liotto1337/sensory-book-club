import type { Question } from "@/types";

export const questions: Question[] = [
  {
    id: "place",
    title: "Где вы читали лучшую книгу в жизни?",
    subtitle: "Закройте глаза и вспомните, где вы были",
    options: [
      { id: "place-sea", label: "У моря", hint: "Песок, ветер, горизонт", emoji: "🌊", tags: ["sea"] },
      { id: "place-forest", label: "В лесу", hint: "Тень деревьев и тропинки", emoji: "🌲", tags: ["forest"] },
      { id: "place-home", label: "Дома под пледом", hint: "Мягкий свет и тёплый чай", emoji: "🛋️", tags: ["home"] },
      { id: "place-cafe", label: "В кафе", hint: "Столик у окна", emoji: "☕", tags: ["cafe"] },
    ],
  },
  {
    id: "scent",
    title: "Какой запах вы помните?",
    subtitle: "Тот, что возвращает вас в ту минуту",
    options: [
      { id: "scent-salt", label: "Соль и дерево", hint: "Причал, нагретые доски", emoji: "🪵", tags: ["salt_wood"] },
      { id: "scent-pine", label: "Хвоя и дождь", hint: "Мокрая земля и смола", emoji: "🌧️", tags: ["pine_rain"] },
      { id: "scent-coffee", label: "Кофе и бумага", hint: "Свежая обжарка и страницы", emoji: "📜", tags: ["coffee_paper"] },
      { id: "scent-strawberry", label: "Клубника и трава", hint: "Июльский полдень на грядке", emoji: "🍓", tags: ["strawberry_grass"] },
    ],
  },
  {
    id: "season",
    title: "Какое было время года и суток?",
    subtitle: "Свет за окном тоже часть истории",
    options: [
      { id: "season-summer", label: "Лето, сумерки", hint: "Длинные розовые вечера", emoji: "🌅", tags: ["summer", "evening"] },
      { id: "season-autumn", label: "Осень, утро", hint: "Туман и холодный воздух", emoji: "🍂", tags: ["autumn", "morning"] },
      { id: "season-winter", label: "Зима, вечер", hint: "Снег и жёлтые окна", emoji: "❄️", tags: ["winter", "evening"] },
      { id: "season-spring", label: "Весна, день", hint: "Капель и первое солнце", emoji: "🌱", tags: ["spring", "day"] },
    ],
  },
  {
    id: "sound",
    title: "Что звучало на фоне?",
    subtitle: "Звук, под который переворачивались страницы",
    options: [
      { id: "sound-waves", label: "Шум волн", hint: "Ритмично и бесконечно", emoji: "🐚", tags: ["waves"] },
      { id: "sound-silence", label: "Тишина", hint: "Слышно, как шуршит бумага", emoji: "🤫", tags: ["silence"] },
      { id: "sound-voices", label: "Разговоры людей", hint: "Уютный гул вокруг", emoji: "💬", tags: ["voices"] },
      { id: "sound-music", label: "Музыка", hint: "Пластинка или радио", emoji: "🎶", tags: ["music"] },
    ],
  },
  {
    id: "feeling",
    title: "Что вы чувствовали в теле?",
    subtitle: "Самое честное воспоминание — телесное",
    options: [
      { id: "feeling-calm", label: "Тепло и спокойствие", hint: "Плечи опущены, дыхание ровное", emoji: "🕯️", tags: ["calm"] },
      { id: "feeling-light", label: "Лёгкость", hint: "Будто можно взлететь", emoji: "🪶", tags: ["lightness"] },
      { id: "feeling-sad", label: "Грусть", hint: "Светлая, с комком в горле", emoji: "🌫️", tags: ["sadness"] },
      { id: "feeling-inspired", label: "Вдохновение", hint: "Хочется что-то создать", emoji: "✨", tags: ["inspiration"] },
    ],
  },
];
