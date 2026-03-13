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
  ShoppingBag,
  Gem,
  Cpu,
  Hammer,
  Grape,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
  const iconMap: Record<string, LucideIcon> = {
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
    <div className="w-full relative bg-white/40 backdrop-blur-md border-b border-gray-100/50 pb-3 pt-1">
      <div className="max-w-7xl mx-auto relative px-4 sm:px-8 flex items-center">
        
        {/* Left Scroll Button — only on mobile/tablet */}
        {canScrollLeft && (
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-2 z-20 w-8 h-8 md:hidden flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 hover:scale-110 active:scale-95 text-[#1A1C1E] transition-all animate-in fade-in duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Categories Container — no arrows on desktop, thin scrollbar instead */}
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto flex gap-2 sm:gap-3 py-1 scroll-smooth items-center category-nav-scroll"
        >
          {sortedCategories.map((cat) => {
            const Icon = iconMap[cat.slug] || Utensils;
            const isActive = activeCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-500 shrink-0 group border shadow-sm ${
                  isActive 
                    ? "bg-[#1A1C1E] border-[#1A1C1E] text-white shadow-xl shadow-black/10 scale-105" 
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:text-[#1A1C1E] hover:bg-white"
                }`}
              >
                <div className={`p-1 rounded-lg transition-all duration-500 ${
                  isActive ? "bg-white/10" : "bg-gray-50 group-hover:bg-orange-50"
                }`}>
                  <Icon className={`w-3.5 h-3.5 transition-transform duration-500 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-orange-500 group-hover:rotate-6 shadow-sm"
                  }`} />
                </div>
                <span className={`text-[12px] font-bold tracking-tight transition-all duration-300 ${
                  isActive ? "text-white" : "group-hover:text-[#1A1C1E]"
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button — only on mobile/tablet */}
        {canScrollRight && (
          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-2 z-20 w-8 h-8 md:hidden flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 hover:scale-110 active:scale-95 text-[#1A1C1E] transition-all animate-in fade-in duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Scroll Masks — only on mobile when arrows visible */}
        {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-8 md:w-0 md:opacity-0 md:pointer-events-none bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none z-10" />}
        {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-8 md:w-0 md:opacity-0 md:pointer-events-none bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none z-10" />}
      </div>
    </div>
  );
}
