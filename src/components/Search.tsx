"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Loader2, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Product } from "@/types/database";
import Image from "next/image";
import Link from "next/link";
import { useCategoryStore } from "@/store/category";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { setActiveCategoryId } = useCategoryStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("*")
          .ilike("name", `%${query}%`)
          .limit(5);
        
        setResults(data || []);
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setIsOpen(false);
    setQuery("");
    // Scroll to catalog
    const catalog = document.getElementById('catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-sm hidden md:block">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SearchIcon className="w-4 h-4" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук страв..."
          className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-10 text-sm font-bold shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all placeholder:text-gray-300"
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-2">
            {results.length > 0 ? (
              results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product.category_id)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors group text-left"
                >
                  <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0 bg-gray-50">
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <SearchIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-[#1A1C1E] truncate group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs font-black text-gray-900">{product.price} ₴</span>
                      {product.average_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-orange-400 text-orange-400" />
                          <span className="text-[10px] font-bold text-gray-400">{product.average_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400 font-medium text-sm">Нічого не знайдено 🔍</p>
              </div>
            )}
          </div>
          {results.length > 0 && (
            <div className="bg-gray-50/50 p-3 border-t border-gray-50 text-center">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Показано перші 5 результатів</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
