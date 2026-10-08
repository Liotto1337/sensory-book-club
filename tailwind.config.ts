import type { Config } from "tailwindcss";

// Цвета живут в CSS-переменных (app/globals.css), чтобы тёмная тема переопределяла их в одном месте.
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: token("cream"),
        sand: token("sand"),
        linen: token("linen"),
        ink: {
          DEFAULT: token("ink"),
          soft: token("ink-soft"),
          muted: token("ink-muted"),
        },
        terracotta: {
          DEFAULT: token("terracotta"),
          dark: token("terracotta-dark"),
          light: token("terracotta-light"),
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        control: "12px",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lifted: "var(--shadow-lifted)",
      },
    },
  },
  plugins: [],
};

export default config;
