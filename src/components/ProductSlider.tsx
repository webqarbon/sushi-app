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
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-gray-50 text-wrap">
          <div>
            <div className="inline-flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <Star className="w-3 h-3 fill-orange-400" />
              Топ вибір
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#1A1C1E] tracking-tight leading-none">
              Найкращі продукти
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className={`w-11 h-11 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95 ${
                !showLeftArrow ? "opacity-20 pointer-events-none" : "opacity-100"
              }`}
              aria-label="Назад"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`w-11 h-11 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95 ${
                !showRightArrow ? "opacity-20 pointer-events-none" : "opacity-100"
              }`}
              aria-label="Вперед"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider Area */}
        <div className="relative py-12 bg-gray-50/30 group">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-10"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {finalItems.map((product) => (
              <div
                key={product.id}
                className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] scroll-snap-align-start"
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* Subtle Side Overlays for focus */}
          <div className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/40 to-transparent pointer-events-none transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/40 to-transparent pointer-events-none transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center px-10 py-4 border-t border-gray-50">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
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
