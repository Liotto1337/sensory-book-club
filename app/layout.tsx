import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/Toaster";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Сенсорный книжный клуб — книга, которая пахнет твоим воспоминанием",
  description:
    "Подбираем книги по сенсорным воспоминаниям: запахам, звукам и местам. Книга, аромат, плейлист и тактильный предмет в одном наборе.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F4EE" },
    { media: "(prefers-color-scheme: dark)", color: "#1B1712" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: класс .dark ставит themeInitScript до гидрации
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
