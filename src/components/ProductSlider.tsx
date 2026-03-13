"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Product } from "@/types/database";
import ProductCard from "./ProductCard";

interface ProductSliderProps {
  products: Product[];
}

const SCROLL_STEP = 0.75;
const TOLERANCE = 2;

export default function ProductSlider({ products }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const items = [...products]
    .filter((p) => (p.average_rating || 0) > 0 || (p.reviews_count || 0) > 0)
    .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    .slice(0, 10);

  const finalItems = items.length >= 4 ? items : [...products].slice(0, 10);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    setCanScrollLeft(scrollLeft > TOLERANCE);
    setCanScrollRight(scrollLeft < maxScroll - TOLERANCE);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scheduleUpdate = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(updateScrollState);
      });
    };

    scheduleUpdate();
    const fallbackTimer = setTimeout(scheduleUpdate, 100);

    const ro = new ResizeObserver(scheduleUpdate);
    ro.observe(el);

    const mo = new MutationObserver(scheduleUpdate);
    mo.observe(el, { childList: true, subtree: true });

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      clearTimeout(fallbackTimer);
      ro.disconnect();
      mo.disconnect();
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [finalItems.length, updateScrollState]);

  const scroll = useCallback(
    (dir: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;
      if (dir === "left" && !canScrollLeft) return;
      if (dir === "right" && !canScrollRight) return;

      const step = el.clientWidth * SCROLL_STEP;
      const target = Math.max(
        0,
        Math.min(
          el.scrollWidth - el.clientWidth,
          el.scrollLeft + (dir === "right" ? step : -step)
        )
      );

      el.scrollTo({ left: target, behavior: "smooth" });
    },
    [canScrollLeft, canScrollRight]
  );

  if (finalItems.length === 0) return null;

  return (
    <section className="w-full">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 pt-6 pb-4 sm:pt-8 sm:pb-5 border-b border-gray-50">
          <div>
            <div className="inline-flex items-center gap-1.5 text-orange-400 font-bold text-[10px] uppercase tracking-[0.15em] mb-1">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-orange-400" />
              Топ вибір
            </div>
            <h2 className="text-2xl font-bold text-[#1A1C1E] tracking-tight leading-tight">
              Найкращі товари
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Прокрутити вліво"
              className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Прокрутити вправо"
              className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative px-4 sm:px-6 py-4 sm:py-5 md:py-6 bg-gray-50/30">
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pt-2 pb-6 -my-2"
            style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
          >
            {finalItems.map((product) => (
              <div
                key={product.id}
                className="w-[220px] min-w-[220px] sm:w-[240px] sm:min-w-[240px] md:w-[260px] md:min-w-[260px] flex shrink-0 flex-col"
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductCard product={product} compact />
              </div>
            ))}
          </div>

          <div
            className={`absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-white/50 to-transparent pointer-events-none transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-white/50 to-transparent pointer-events-none transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
