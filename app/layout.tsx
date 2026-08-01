import type { Metadata } from "next";
import { Playfair_Display, Inter, Lexend, Luxurious_Script } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const luxuriousScript = Luxurious_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-luxurious-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KeksPoint — Zagreb's Cult Cookie Shop",
  description:
    "Freshly baked American-style cookies in Zagreb — crispy outside, soft inside, richly filled. Papova ulica 2, open daily 10:00–23:00.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${lexend.variable} ${luxuriousScript.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
