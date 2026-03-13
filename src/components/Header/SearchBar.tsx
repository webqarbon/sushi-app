"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Loader2, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Product } from "@/types/database";
import Image from "next/image";
import { useCategoryStore } from "@/store/category";

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
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
    onClose?.();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-full md:max-w-sm">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
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
          placeholder="Пошук товарів..."
          autoFocus={!!onClose}
          className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-10 text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all placeholder:text-slate-400"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-2">
            {results.length > 0 ? (
              results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product.category_id)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group text-left"
                >
                  <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0 bg-slate-50">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <SearchIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs font-semibold text-slate-700">{product.price} ₴</span>
                      {(product.average_rating || 0) > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-orange-400 text-orange-400" />
                          <span className="text-[10px] font-medium text-slate-400">
                            {(product.average_rating as number).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-400 font-medium text-sm">Нічого не знайдено</p>
              </div>
            )}
          </div>
          {results.length > 0 && (
            <div className="bg-slate-50/50 p-3 border-t border-slate-100 text-center">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Показано перші 5 результатів
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
