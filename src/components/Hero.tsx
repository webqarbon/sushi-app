"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Share2, Sparkles, Zap, Gift } from "lucide-react";

const SLIDES = [
  {
    title: "Подарунок за відгук!",
    description: "Залишай відгук у Google та отримуй смачний подарунок до наступного замовлення!",
    image: "/images/hero/slide1.png",
    fallbackImage: "/images/hero/slide1.png",
    badge: "Акція тижня",
    icon: <Gift className="w-3.5 h-3.5" />,
    link: "/#reviews",
    btnText: "Детальніше",
    color: "orange"
  },
  {
    title: "Новинки в меню!",
    description: "Спробуйте наші нові страви за спеціальною ціною. Тільки цього тижня.",
    image: "/images/hero/slide2.png",
    fallbackImage: "/images/hero/slide2.png",
    badge: "Скоро",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    link: "/#catalog",
    btnText: "До каталогу",
    color: "blue"
  },
  {
    title: "Швидка доставка",
    description: "Насолоджуйтесь улюбленими стравами вже за 30-45 хвилин. Гарантуємо якість.",
    image: "/images/hero/slide3.png",
    fallbackImage: "/images/hero/slide3.png",
    badge: "Швидкість",
    icon: <Zap className="w-3.5 h-3.5" />,
    link: "/#delivery",
    btnText: "Умови доставки",
    color: "emerald"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  const slide = SLIDES[current];

  return (
    <section className="relative group w-full mb-12">
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium flex flex-col lg:flex-row items-center border border-white/50 min-h-[480px]">
        
        {/* Left Side: Images */}
        <div className="w-full lg:w-3/5 relative h-[320px] lg:h-[480px] bg-[#F9FAFB] flex items-center justify-center overflow-hidden border-r border-gray-50">
          <div className="absolute inset-0 w-full h-full">
            {SLIDES.map((s, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  current === idx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              >
                <Image 
                  src={s.image} 
                  alt={s.title} 
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                />
              </div>
            ))}
          </div>
          
          {/* Slider Arrows */}
          <button 
            onClick={prev}
            className="absolute left-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 z-10 active:scale-95"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button 
            onClick={next}
            className="absolute right-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 z-10 active:scale-95"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center text-left">
          <div className={`mb-6 flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${
            slide.color === 'orange' ? 'text-orange-400' : 
            slide.color === 'blue' ? 'text-blue-400' : 'text-emerald-400'
          }`}>
            <span className={`w-8 h-[2px] ${
              slide.color === 'orange' ? 'bg-orange-400' : 
              slide.color === 'blue' ? 'bg-blue-400' : 'bg-emerald-400'
            }`}></span>
            <div className="flex items-center gap-1.5">
              {slide.icon}
              {slide.badge}
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1A1C1E] leading-[1.1] mb-6 tracking-tight animate-in slide-in-from-bottom-2 duration-500">
            {slide.title}
          </h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed mb-10 opacity-80 animate-in slide-in-from-bottom-4 duration-700">
            {slide.description}
          </p>
          
          <Link 
            href={slide.link}
            className={`w-full sm:w-fit inline-flex items-center justify-center px-12 h-16 text-xs font-black text-white rounded-[1.25rem] shadow-xl transition-all active:scale-95 uppercase tracking-widest gap-4 group/btn ${
              slide.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 
              slide.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 
              'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {slide.btnText}
            <Share2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              current === idx 
                ? `w-10 shadow-sm ${
                    slide.color === 'orange' ? 'bg-orange-400' : 
                    slide.color === 'blue' ? 'bg-blue-400' : 'bg-emerald-400'
                  }` 
                : "w-1.5 bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
