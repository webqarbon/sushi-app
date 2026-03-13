import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
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
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A1C1E',
              color: '#fff',
              fontFamily: 'var(--font-outfit), sans-serif',
              fontWeight: '700',
              fontSize: '14px',
              borderRadius: '1.5rem',
              padding: '14px 20px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
              maxWidth: '420px',
            },
            success: {
              iconTheme: { primary: '#f97316', secondary: '#fff' },
              style: {
                background: '#1A1C1E',
                color: '#fff',
              }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
              style: {
                background: '#1A1C1E',
                color: '#fff',
              }
            },
          }}
        />
      </body>
    </html>
  );
}
