"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-8 relative group">
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium flex flex-col lg:flex-row items-center border border-white min-h-[450px]">
        
        {/* Left Side: Images (Mocking the slider content) */}
        <div className="w-full lg:w-3/5 relative h-[300px] lg:h-[450px] bg-[#F9FAFB] flex items-center justify-center overflow-hidden">
          <img 
            src="https://ooouuetfdrnmdvmhqdji.supabase.co/storage/v1/object/public/products//hero_promo.png" 
            alt="Подарунок за відгук" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as any).src = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1000";
            }}
          />
          
          {/* Slider Arrows */}
          <button className="absolute left-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm flex items-center justify-center text-gray-400 hover:text-[#1A1C1E] transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="absolute right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm flex items-center justify-center text-gray-400 hover:text-[#1A1C1E] transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-2/5 p-8 lg:p-14 flex flex-col justify-center text-left">
          <h2 className="text-3xl lg:text-4xl font-black text-[#1A1C1E] leading-tight mb-4">
            Подарунок за відгук!
          </h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">
            Залишай відгук у Google та отримуй подарунок! Ми цінуємо твою думку.
          </p>
          
          <Link 
            href="/#reviews"
            className="w-fit inline-flex items-center justify-center px-10 h-16 text-sm font-black text-white bg-[#F08060] hover:bg-[#E07050] rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95 uppercase tracking-widest gap-3"
          >
            Детальніше 🤩
            <Share2 className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
      </div>
    </section>
  );
}
