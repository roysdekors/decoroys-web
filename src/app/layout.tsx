import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Decoroys — Mobilya Tasarım",
  description: "Modern ve minimalist mobilya tasarımları. Evinize modernlik ve sadeliği getiriyoruz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${caveat.variable}`}>
      <body className="bg-zinc-50 text-zinc-900 font-sans antialiased min-h-screen flex flex-col selection:bg-black selection:text-white">
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
      </body>
    </html>
  );
}
