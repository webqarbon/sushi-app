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
  const [currentIndex, setCurrentIndex] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const posRef = useRef(0);

  // Take top-10 by rating, then duplicate for infinite loop
  const topProducts = [...products]
    .filter((p) => (p.average_rating || 0) > 0 || (p.reviews_count || 0) > 0)
    .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    .slice(0, 10);

  // Fallback: just take first 10 if no rated products
  const sliderItems =
    topProducts.length >= 4
      ? topProducts
      : [...products].slice(0, 10);

  // Triple duplicated for seamless looping
  const looped = [...sliderItems, ...sliderItems, ...sliderItems];

  const CARD_WIDTH = 280; // px
  const GAP = 24; // px
  const STEP = CARD_WIDTH + GAP;
  const SPEED = 0.4; // px per frame

  // Auto-scroll animation
  useEffect(() => {
    if (sliderItems.length === 0) return;

    const totalWidth = sliderItems.length * STEP;

    const animate = () => {
      if (!isPaused) {
        posRef.current += SPEED;
        if (posRef.current >= totalWidth) {
          posRef.current -= totalWidth;
        }
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
    <section className="w-full mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <div className="inline-flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
            <span className="w-8 h-[2px] bg-orange-400" />
            Топ вибір
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-[#1A1C1E] tracking-tight">
            Найкращі товари
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-1">
            За оцінками наших покупців
          </p>
        </div>

        {/* Manual nav buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => scrollBy("left")}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95"
            aria-label="Назад"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollBy("right")}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95"
            aria-label="Вперед"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slider Track */}
      <div
        className="overflow-hidden relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F3F5F9] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F3F5F9] to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform"
          style={{ width: `${looped.length * STEP}px` }}
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

      {/* Rating stars legend */}
      <div className="flex items-center justify-center gap-2 mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
        Відсортовано за рейтингом покупців
      </div>
    </section>
  );
}
