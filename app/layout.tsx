import type { Metadata, Viewport } from "next";
import { Golos_Text, JetBrains_Mono, Playfair_Display, Sofia_Sans_Condensed } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Toaster } from "@/components/ui/Toaster";
import { themeInitScript } from "@/lib/theme";
import "lenis/dist/lenis.css";
import "./globals.css";

// Заголовки капсом
const sofiaSans = Sofia_Sans_Condensed({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

// Курсив для акцентного слова и названий книг
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  variable: "--font-golos",
  display: "swap",
});

// Подписи, кнопки, навигация
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Сенсорный книжный клуб — книга, которая пахнет твоим воспоминанием",
  description:
    "Подбираем книги по сенсорным воспоминаниям: запахам, звукам и местам. Книга, аромат, плейлист и тактильный предмет в одном наборе.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1EADC" },
    { media: "(prefers-color-scheme: dark)", color: "#15110D" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: класс .dark ставит themeInitScript до гидрации
    <html lang="ru" className={`${sofiaSans.variable} ${playfair.variable} ${golos.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <SmoothScroll />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
