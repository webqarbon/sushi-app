"use client";

import { useMemo } from "react";
import { 
  Beef, 
  Soup, 
  Pizza, 
  Donut, 
  Apple, 
  GlassWater, 
  Utensils, 
  Container,
  Flame,
  LayoutGrid,
  Fish,
  Milk,
  Box,
  ShoppingBag,
  Gem,
  Cpu,
  Waves,
  Hammer,
  Grape,
  Zap,
  Star,
  Settings,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useCategoryStore } from "@/store/category";
import { Category } from "@/types/database";

interface CategoryNavProps {
  categories?: Category[];
  activeCategoryId?: string;
  onSelect?: (id: string) => void;
  isCompact?: boolean;
}

export default function CategoryNav({ 
  categories: propsCategories, 
  activeCategoryId: propsActiveId, 
  onSelect: propsOnSelect,
  isCompact = false
}: CategoryNavProps) {
  const { categories: storeCategories, activeCategoryId: storeActiveId, setActiveCategoryId: storeSetActiveId } = useCategoryStore();

  const categories = propsCategories || storeCategories;
  const activeCategoryId = propsActiveId || storeActiveId;
  const onSelect = propsOnSelect || storeSetActiveId;

  // Map icons based on category slug or name
  const iconMap: Record<string, any> = {
    "sets": LayoutGrid,
    "rolls": Utensils,
    "sushi": Beef,
    "shaurma": Beef,
    "wok": Flame,
    "soups": Soup,
    "snacks": Pizza,
    "desserts": Donut,
    "drinks": GlassWater,
    "ikra": Fish,
    "boroshno": Grape,
    "kosmetika": Gem,
    "makaronni-vyroby": Soup,
    "nozhi-kukhonni": Hammer,
    "ovocheva-konservatsiya": Apple,
    "odnorazovyy-posud": Container,
    "panirovalni-sukhari": Flame,
    "podarunkovi-paketi": ShoppingBag,
    "posud-dlya-sushi": Container,
    "produkti-dlya-sushi": Utensils,
    "ryba-ta-moreprodukty": Fish,
    "roslynne-moloko": Milk,
    "syry": Milk,
    "sousy": GlassWater,
    "spetsiyi-ta-prypravy": Flame,
    "susheni-ovochi": Apple,
    "tekhnika": Cpu
  };

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.order_index - b.order_index);
  }, [categories]);

  const scrollRef = useMemo(() => {
    return (dir: 'left' | 'right') => {
      const el = document.getElementById('compact-nav-scroll');
      if (el) {
        const scrollAmount = 200;
        el.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      }
    };
  }, []);

  if (isCompact) {
    return (
      <div className="w-full relative group/nav flex items-center">
        {/* Left Scroll Button */}
        <button 
          onClick={() => scrollRef('left')}
          className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 opacity-0 group-hover/nav:opacity-100 transition-opacity -ml-4 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>

        <div 
          id="compact-nav-scroll"
          className="flex items-center gap-1 overflow-x-auto hide-scrollbar scroll-smooth px-2 w-full"
        >
          {sortedCategories.map((cat) => {
            const Icon = iconMap[cat.slug] || Utensils;
            const isActive = activeCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 shrink-0 group ${
                  isActive ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-500 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                }`} />
                <span className="text-[10px] font-black uppercase tracking-[0.05em] whitespace-nowrap">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Right Scroll Button */}
        <button 
          onClick={() => scrollRef('right')}
          className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 opacity-0 group-hover/nav:opacity-100 transition-opacity -mr-4 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* Scroll Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none" />
      </div>
    );
  }

  const mainScrollRef = useMemo(() => {
    return (dir: 'left' | 'right') => {
      const el = document.getElementById('main-nav-scroll');
      if (el) {
        const scrollAmount = 350;
        el.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      }
    };
  }, []);

  return (
    <div className="w-full relative group flex items-center">
      {/* Left Scroll Button */}
      <button 
        onClick={() => mainScrollRef('left')}
        className="absolute -left-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 text-gray-400 hover:text-orange-500"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div 
        id="main-nav-scroll"
        className="w-full overflow-x-auto hide-scrollbar flex gap-3 py-6 px-4 scroll-smooth"
      >
        {sortedCategories.map((cat) => {
          const Icon = iconMap[cat.slug] || Utensils;
          const isActive = activeCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex flex-col items-center justify-center min-w-[100px] lg:min-w-[120px] h-[100px] lg:h-[120px] rounded-3xl transition-all duration-300 shrink-0 group border ${
                isActive 
                  ? "bg-white text-orange-500 shadow-2xl shadow-orange-500/15 border-orange-100 ring-4 ring-orange-500/5" 
                  : "bg-white/50 text-gray-500 hover:bg-white hover:text-[#1A1C1E] shadow-sm border-gray-100/50 hover:shadow-xl hover:shadow-slate-200/50"
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all duration-500 ${
                isActive ? "bg-orange-50 scale-110" : "bg-gray-50 group-hover:bg-gray-100 group-hover:scale-105"
              }`}>
                <Icon className={`w-6 h-6 lg:w-7 lg:h-7 transition-colors duration-300 ${
                  isActive ? "text-orange-500" : "text-gray-400 group-hover:text-[#1A1C1E]"
                }`} />
              </div>
              <span className={`text-[11px] lg:text-[13px] font-black tracking-tight mt-2 px-2 text-center leading-tight ${
                isActive ? "text-[#1A1C1E] opacity-100" : "text-gray-500 opacity-60"
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      <button 
        onClick={() => mainScrollRef('right')}
        className="absolute -right-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 text-gray-400 hover:text-orange-500"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scroll Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F3F5F9] via-[#F3F5F9]/20 to-transparent pointer-events-none z-[1]" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F3F5F9] via-[#F3F5F9]/20 to-transparent pointer-events-none z-[1]" />
    </div>
  );
}
