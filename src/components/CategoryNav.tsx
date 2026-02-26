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
    <div className="w-full overflow-x-auto hide-scrollbar flex gap-3 pb-4">
      {sortedCategories.map((cat) => {
        const Icon = iconMap[cat.slug] || Utensils;
        const isActive = activeCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center justify-center min-w-[100px] h-[110px] rounded-3xl transition-all duration-300 border-2 shrink-0 ${
              isActive 
                ? "bg-white border-orange-400 shadow-md scale-105" 
                : "bg-white border-white shadow-sm hover:shadow-md"
            }`}
          >
            <div className={`p-3 rounded-2xl mb-2 ${isActive ? "bg-orange-50" : "bg-gray-50"}`}>
              <Icon className={`w-6 h-6 ${isActive ? "text-orange-500" : "text-[#1A1C1E]"}`} />
            </div>
            <span className={`text-[11px] font-black uppercase tracking-tight ${isActive ? "text-orange-500" : "text-[#1A1C1E]"}`}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
