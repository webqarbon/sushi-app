"use client";

import Link from "next/link";
import { Phone, Navigation, Instagram, MessageCircle, Send, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-black text-xl">F</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900">FROZEN</span>
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed">
              Преміальні заморожені продукти з доставкою до ваших дверей. Смак, якість та зручність у кожній страві.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-xl flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-sky-50 text-gray-400 hover:text-sky-500 rounded-xl flex items-center justify-center transition-all">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-purple-50 text-gray-400 hover:text-purple-500 rounded-xl flex items-center justify-center transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest">Меню сайту</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/#catalog" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">Каталог продуктів</Link>
              <Link href="/#about" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">Про компанію</Link>
              <Link href="/#faq" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">Питання та відповіді</Link>
              <Link href="/profile" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">Особистий кабінет</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest">Контакти</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+380953727599" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Дзвінки</span>
                  <span className="text-sm font-black text-gray-900">+380 95 372 75 99</span>
                </div>
              </a>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Адреса</span>
                  <span className="text-sm font-black text-gray-900">вул. Грушевського, 97в</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter / Work Time */}
          <div className="flex flex-col gap-6">
            <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest">Графік роботи</h4>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Пн - Пт:</span>
                  <span className="text-xs font-black text-gray-900">09:00 - 21:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Сб - Нд:</span>
                  <span className="text-xs font-black text-gray-900">10:00 - 19:00</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-[10px] text-gray-400 font-medium leading-tight italic">
                  * Працюємо без перерв на обід, щоб ви завжди могли насолодитися якісними продуктами.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            © 2026 FROZEN MARKET. ВСІ ПРАВА ЗАХИЩЕНІ.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
            Зроблено з <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> для вас
          </div>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-xs font-extrabold text-gray-500 hover:text-blue-600 uppercase tracking-tighter">Політика конфіденційності</Link>
            <Link href="/terms" className="text-xs font-extrabold text-gray-500 hover:text-blue-600 uppercase tracking-tighter">Публічна оферта</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
