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
    "sushi": Beef,
    "shaurma": Beef,
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
    <div className="w-full overflow-x-auto hide-scrollbar flex gap-3 py-2">
      {sortedCategories.map((cat) => {
        const Icon = iconMap[cat.slug] || Utensils;
        const isActive = activeCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center justify-center min-w-[100px] lg:min-w-[120px] h-[100px] lg:h-[120px] rounded-3xl transition-all duration-300 shrink-0 group border ${
              isActive 
                ? "bg-white text-orange-500 shadow-xl shadow-orange-500/10 border-orange-100" 
                : "bg-white/50 text-gray-500 hover:bg-white hover:text-[#1A1C1E] shadow-sm border-gray-100/50 hover:shadow-md"
            }`}
          >
            <div className={`p-2.5 rounded-2xl transition-all duration-500 ${
              isActive ? "bg-orange-50 scale-110" : "bg-gray-50 group-hover:bg-gray-100 group-hover:scale-105"
            }`}>
              <Icon className={`w-6 h-6 lg:w-7 lg:h-7 transition-colors duration-300 ${
                isActive ? "text-orange-500" : "text-gray-400 group-hover:text-[#1A1C1E]"
              }`} />
            </div>
            <span className={`text-[12px] lg:text-[13px] font-black tracking-tight mt-3 ${
              isActive ? "text-[#1A1C1E]" : "text-gray-500"
            }`}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
