"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Product } from "@/types/database";
import ProductCard from "./ProductCard";

interface ProductSliderProps {
  products: Product[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const posRef = useRef(0);

  // Top-10 by rating
  const topProducts = [...products]
    .filter((p) => (p.average_rating || 0) > 0 || (p.reviews_count || 0) > 0)
    .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    .slice(0, 10);

  const sliderItems =
    topProducts.length >= 4 ? topProducts : [...products].slice(0, 10);

  // Triple-duplicate for seamless loop
  const looped = [...sliderItems, ...sliderItems, ...sliderItems];

  const CARD_WIDTH = 272;
  const GAP = 20;
  const STEP = CARD_WIDTH + GAP;
  const SPEED = 0.45;

  useEffect(() => {
    if (sliderItems.length === 0) return;
    const totalWidth = sliderItems.length * STEP;

    const animate = () => {
      if (!isPaused) {
        posRef.current += SPEED;
        if (posRef.current >= totalWidth) posRef.current -= totalWidth;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
        }
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused, sliderItems.length, STEP]);

  const scrollBy = (dir: "left" | "right") => {
    posRef.current = Math.max(
      0,
      posRef.current + (dir === "right" ? STEP * 2 : -STEP * 2)
    );
  };

  if (sliderItems.length === 0) return null;

  return (
    <section className="w-full">
      {/* ── Wrapper card with clear visual boundary ── */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">

        {/* Header inside card */}
        <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-gray-50">
          <div>
            <div className="inline-flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <Star className="w-3 h-3 fill-orange-400" />
              Топ вибір
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#1A1C1E] tracking-tight leading-none">
              Найкращі товари
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollBy("left")}
              className="w-11 h-11 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95"
              aria-label="Назад"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollBy("right")}
              className="w-11 h-11 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95"
              aria-label="Вперед"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider track area */}
        <div
          className="relative py-12 overflow-hidden bg-gray-50/30"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Left/right fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={trackRef}
            className="flex will-change-transform px-4"
            style={{
              gap: `${GAP}px`,
              width: `${looped.length * STEP}px`,
            }}
          >
            {looped.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                style={{ width: `${CARD_WIDTH}px`, flexShrink: 0 }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer inside card */}
        <div className="flex items-center justify-center px-10 py-4 border-t border-gray-50">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Наведіть щоб зупинити · Відсортовано за рейтингом покупців
          </span>
        </div>
      </div>
    </section>
  );
}
