"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative group w-full mb-12">
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium flex flex-col lg:flex-row items-center border border-white/50 min-h-[480px]">
        
        {/* Left Side: Images (Mocking the slider content) */}
        <div className="w-full lg:w-3/5 relative h-[320px] lg:h-[480px] bg-[#F9FAFB] flex items-center justify-center overflow-hidden border-r border-gray-50">
          <img 
            src="https://ooouuetfdrnmdvmhqdji.supabase.co/storage/v1/object/public/products//hero_promo.png" 
            alt="Подарунок за відгук" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
            onError={(e) => {
              (e.target as any).src = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1000";
            }}
          />
          
          {/* Slider Arrows */}
          <button className="absolute left-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button className="absolute right-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center text-left">
          <div className="mb-6 flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <span className="w-8 h-[2px] bg-orange-400"></span>
            Акція тижня
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1A1C1E] leading-[1.1] mb-6 tracking-tight">
            Подарунок <br className="hidden lg:block" /> за відгук!
          </h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed mb-10 opacity-80">
            Залишай відгук у Google та отримуй смачний подарунок до наступного замовлення!
          </p>
          
          <Link 
            href="/#reviews"
            className="w-full sm:w-fit inline-flex items-center justify-center px-12 h-16 text-xs font-black text-white bg-orange-500 hover:bg-orange-600 rounded-[1.25rem] shadow-xl shadow-orange-500/20 transition-all active:scale-95 uppercase tracking-widest gap-4 group/btn"
          >
            Детальніше
            <Share2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-8">
        <div className="w-10 h-1.5 rounded-full bg-orange-400 shadow-sm"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
      </div>
    </section>
  );
}
