"use client";

import { useState, useMemo } from "react";
import { Flame, Star, ArrowDown01 as ArrowDownIcon, ArrowUp10 as ArrowUpIcon } from "lucide-react";
import { Category, Product } from "@/types/database";
import ProductCard from "./ProductCard";

interface CatalogProps {
  categories: Category[];
  products: Product[];
  activeCategoryId?: string;
}

type SortType = 'popular' | 'price_asc' | 'price_desc' | 'rating';

export default function Catalog({ categories, products, activeCategoryId }: CatalogProps) {
  const [sortBy, setSortBy] = useState<SortType>('popular');

  const targetCategory = useMemo(() => {
    return activeCategoryId 
      ? categories.find(c => c.id === activeCategoryId) 
      : [...categories].sort((a, b) => a.order_index - b.order_index)[0];
  }, [categories, activeCategoryId]);

  const sortedProducts = useMemo(() => {
    if (!targetCategory) return [];
    const base = products.filter(p => p.category_id === targetCategory.id);
    
    switch (sortBy) {
      case 'price_asc': return [...base].sort((a, b) => a.price - b.price);
      case 'price_desc': return [...base].sort((a, b) => b.price - a.price);
      case 'rating': return [...base].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
      case 'popular': return [...base].sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
      default: return base;
    }
  }, [products, targetCategory, sortBy]);

  if (!categories.length || !products.length) {
    return (
      <div className="text-center py-12 text-base text-gray-500 font-medium">
        Каталог порожній.
      </div>
    );
  }

  if (!targetCategory) return null;

  return (
    <div className="flex flex-col gap-12">
      <div key={targetCategory.id}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/50 p-6 rounded-[2.5rem] border border-gray-100/50">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#1A1C1E] uppercase">
            {targetCategory.name}
          </h2>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 bg-gray-50/50 sm:bg-white p-1.5 rounded-[1.5rem] sm:rounded-2xl border border-gray-100/50 sm:border-gray-50 w-full sm:w-auto">
            {[
              { id: 'popular', label: 'Топ', icon: Flame },
              { id: 'price_asc', label: 'Дешеві', icon: ArrowUpIcon },
              { id: 'price_desc', label: 'Дорогі', icon: ArrowDownIcon },
              { id: 'rating', label: 'Рейтинг', icon: Star },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id as SortType)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  sortBy === option.id 
                    ? "bg-[#1A1C1E] text-white shadow-md shadow-black/5" 
                    : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100/20"
                }`}
              >
                <option.icon className={`w-3 h-3 ${sortBy === option.id ? "text-orange-400" : ""}`} />
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {sortedProducts.length === 0 ? (
          <p className="text-center text-base text-gray-400 py-12 font-medium">У цій категорії поки немає товарів.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} variant="catalog" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
