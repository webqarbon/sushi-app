"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Product } from "@/types/database";
import ProductCard from "./ProductCard";

interface ProductSliderProps {
  products: Product[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Top-10 by rating
  const sliderItems = [...products]
    .filter((p) => (p.average_rating || 0) > 0 || (p.reviews_count || 0) > 0)
    .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    .slice(0, 10);

  const finalItems = sliderItems.length >= 4 ? sliderItems : [...products].slice(0, 10);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [finalItems]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (finalItems.length === 0) return null;

  return (
    <section className="w-full">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-6 pb-4 sm:pt-8 sm:pb-5 border-b border-gray-50">
          <div>
            <div className="inline-flex items-center gap-1.5 text-orange-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.15em] mb-1">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-orange-400" />
              Топ вибір
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1C1E] tracking-tight leading-tight">
              Найкращі продукти
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className={`w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95 ${
                !showLeftArrow ? "opacity-20 pointer-events-none" : "opacity-100"
              }`}
              aria-label="Назад"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95 ${
                !showRightArrow ? "opacity-20 pointer-events-none" : "opacity-100"
              }`}
              aria-label="Вперед"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slider Area */}
        <div className="relative py-5 sm:py-6 md:py-8 bg-gray-50/30">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {finalItems.map((product) => (
              <div
                key={product.id}
                className="min-w-[220px] w-[220px] sm:min-w-[240px] sm:w-[240px] md:min-w-[260px] md:w-[260px] scroll-snap-align-start shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductCard product={product} compact />
              </div>
            ))}
          </div>
          
          {/* Subtle Side Overlays */}
          <div className={`absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-white/50 to-transparent pointer-events-none transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-white/50 to-transparent pointer-events-none transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center px-4 sm:px-6 py-3 border-t border-gray-50">
          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Відсортовано за рейтингом покупців
          </span>
        </div>
      </div>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
