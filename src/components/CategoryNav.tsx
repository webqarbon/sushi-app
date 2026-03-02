"use client";

import { useMemo, useState, useRef, useEffect } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [propsCategories, storeCategories]);

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

  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length === 0) return;

      const currentScroll = el.scrollLeft;
      const containerWidth = el.clientWidth;
      
      let targetScroll = currentScroll;
      const tolerance = 20; // small buffer to detect "current" item effectively

      if (dir === 'right') {
        const nextItem = children.find(child => child.offsetLeft > currentScroll + tolerance);
        if (nextItem) {
          // Subtract a small amount to keep some of the previous gap/padding visible for context
          targetScroll = nextItem.offsetLeft - (isCompact ? 12 : 24);
        } else {
          targetScroll = el.scrollWidth - containerWidth;
        }
      } else {
        const prevItem = [...children].reverse().find(child => child.offsetLeft < currentScroll - tolerance);
        if (prevItem) {
          targetScroll = prevItem.offsetLeft - (isCompact ? 12 : 24);
        } else {
          targetScroll = 0;
        }
      }

      el.scrollTo({ 
        left: Math.max(0, targetScroll), 
        behavior: 'smooth' 
      });
    }
  };

  if (isCompact) {
    return (
      <div className="w-full relative flex items-center">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 z-20 w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 -ml-2 hover:scale-110 active:scale-95 transition-all animate-in fade-in zoom-in duration-300"
          >
            <ChevronLeft className="w-4 h-4 text-gray-900" />
          </button>
        )}

        <div 
          ref={scrollContainerRef}
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
        {canScrollRight && (
          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 z-20 w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 -mr-2 hover:scale-110 active:scale-95 transition-all animate-in fade-in zoom-in duration-300"
          >
            <ChevronRight className="w-4 h-4 text-gray-900" />
          </button>
        )}

        {/* Scroll Masks */}
        {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none z-10" />}
        {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none z-10" />}
      </div>
    );
  }

  return (
    <div className="w-full relative group flex items-center">
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button 
          onClick={() => handleScroll('left')}
          className="absolute -left-5 z-20 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-2xl border border-gray-100 hover:scale-110 active:scale-95 text-[#1A1C1E] transition-all animate-in fade-in slide-in-from-right-2 duration-300 ring-4 ring-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto hide-scrollbar flex gap-3 py-6 px-4 scroll-smooth"
      >
        {sortedCategories.map((cat) => {
          const Icon = iconMap[cat.slug] || Utensils;
          const isActive = activeCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex flex-col items-center justify-center min-w-[110px] lg:min-w-[130px] h-[110px] lg:h-[130px] rounded-[2.5rem] transition-all duration-300 shrink-0 group border-2 ${
                isActive 
                  ? "bg-white text-orange-500 shadow-2xl shadow-orange-500/15 border-orange-100 ring-8 ring-orange-500/5 translate-y-[-4px]" 
                  : "bg-white/50 text-gray-500 hover:bg-white hover:text-[#1A1C1E] shadow-sm border-gray-100/50 hover:shadow-xl hover:shadow-slate-200/50 hover:translate-y-[-2px]"
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all duration-500 ${
                isActive ? "bg-orange-50 scale-110" : "bg-gray-50 group-hover:bg-gray-100 group-hover:scale-105"
              }`}>
                <Icon className={`w-6 h-6 lg:w-7 lg:h-7 transition-colors duration-300 ${
                  isActive ? "text-orange-500" : "text-gray-400 group-hover:text-[#1A1C1E]"
                }`} />
              </div>
              <span className={`text-[10px] lg:text-[12px] font-black tracking-tight mt-2 px-2 text-center uppercase leading-tight ${
                isActive ? "text-[#1A1C1E] opacity-100" : "text-gray-500 opacity-60"
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button 
          onClick={() => handleScroll('right')}
          className="absolute -right-5 z-20 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-2xl border border-gray-100 hover:scale-110 active:scale-95 text-[#1A1C1E] transition-all animate-in fade-in slide-in-from-left-2 duration-300 ring-4 ring-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Scroll Masks */}
      {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F3F5F9] via-[#F3F5F9]/40 to-transparent pointer-events-none z-10" />}
      {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F3F5F9] via-[#F3F5F9]/40 to-transparent pointer-events-none z-10" />}
    </div>
  );
}
