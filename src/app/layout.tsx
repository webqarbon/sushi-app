import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FROZEN | Заморожені продукти преміум якості",
  description: "Швидка доставка смачних заморожених страв. Отримуйте до 10% бонусів з кожної покупки!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-gray-900`}>
        <Header />
        <main className="flex-1 shrink-0 bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
