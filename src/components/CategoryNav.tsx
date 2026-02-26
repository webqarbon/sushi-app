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
  LayoutGrid
} from "lucide-react";
import { Category } from "@/types/database";

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId?: string;
  onSelect: (id: string) => void;
}

export default function CategoryNav({ categories, activeCategoryId, onSelect }: CategoryNavProps) {
  // Map icons based on category slug or name
  const iconMap: Record<string, any> = {
    "sets": LayoutGrid,
    "rolls": Utensils,
    "sushi": Beef, // Approximate for sushi
    "shaurma": Beef, // Approximate
    "wok": Flame,
    "soups": Soup,
    "snacks": Pizza,
    "desserts": Donut,
    "drinks": GlassWater,
  };

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.order_index - b.order_index);
  }, [categories]);

  return (
    <div className="w-full overflow-x-auto hide-scrollbar flex gap-4 pb-2">
      {sortedCategories.map((cat) => {
        const Icon = iconMap[cat.slug] || Utensils;
        const isActive = activeCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 shrink-0 whitespace-nowrap group ${
              isActive 
                ? "bg-white text-orange-500 shadow-premium border-transparent" 
                : "bg-white/50 text-gray-500 hover:bg-white hover:text-[#1A1C1E] shadow-sm border border-gray-100/50"
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors duration-300 ${
              isActive ? "bg-orange-50" : "bg-gray-100 group-hover:bg-gray-50"
            }`}>
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? "text-orange-500" : "text-gray-400 group-hover:text-[#1A1C1E]"
              }`} />
            </div>
            <span className={`text-[13px] font-black tracking-tight ${
              isActive ? "text-[#1A1C1E]" : ""
            }`}>
              {cat.name}
            </span>
            {isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}
