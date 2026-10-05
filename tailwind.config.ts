import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F8F4EE",
        sand: "#EFE6D8",
        linen: "#FFFDF9",
        ink: {
          DEFAULT: "#2C2418",
          soft: "#5C5144",
          muted: "#8A7E70",
        },
        terracotta: {
          DEFAULT: "#C97B5A",
          dark: "#B0664A",
          light: "#F3DED3",
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
        soft: "0 4px 24px -8px rgba(44, 36, 24, 0.12)",
        lifted: "0 12px 40px -12px rgba(44, 36, 24, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
