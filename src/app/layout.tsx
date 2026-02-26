import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
      <body className={`${outfit.variable} font-sans antialiased min-h-screen flex flex-col bg-[#F3F5F9] text-gray-900`}>
        <Header />
        <main className="flex-1 shrink-0">
          {children}
        </main>
      </body>
    </html>
  );
}
