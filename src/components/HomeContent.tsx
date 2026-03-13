"use client";

import { useEffect, useRef } from "react";
import Hero from "./Hero";
import ProductSlider from "./ProductSlider";
import Catalog from "./Catalog";
import AboutSection from "./AboutSection";
import ContactForm from "./ContactForm";
import FAQSection from "./FAQSection";
import { Category, Product } from "@/types/database";
import { useCategoryStore } from "@/store/category";

interface HomeContentProps {
  categories: Category[];
  products: Product[];
}

export default function HomeContent({ categories, products }: HomeContentProps) {
  const { activeCategoryId, setActiveCategoryId, setCategories } = useCategoryStore();
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  useEffect(() => {
    if (!activeCategoryId) return;
    const timeoutId = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
    return () => window.clearTimeout(timeoutId);
  }, [activeCategoryId]);

  const handleResetToHome = () => {
    setActiveCategoryId("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showHeroAndSlider = !activeCategoryId;

  return (
    <div className="flex flex-col gap-0 pb-12">

      {/* Category Navigation is now handled globally in the Header */}

      {/* 2. Hero + Slider OR Catalog — animated switch */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* HERO SECTION — visible only on home state */}
        <div
          className={`transition-all duration-500 ${
            showHeroAndSlider
              ? "opacity-100 max-h-[1200px] mb-6"
              : "opacity-0 max-h-0 overflow-hidden pointer-events-none mb-0"
          }`}
        >
          <Hero />
        </div>

        {/* PRODUCT SLIDER — visible only on home state */}
        <div
          className={`transition-all duration-500 delay-100 ${
            showHeroAndSlider
              ? "opacity-100 max-h-[2000px] mb-6"
              : "opacity-0 max-h-0 overflow-hidden pointer-events-none mb-0"
          }`}
        >
          <ProductSlider products={products} />
        </div>

        {/* CATALOG — visible when category selected; scroll-margin so header doesn't cover title/filters */}
        <div
          ref={catalogRef}
          id="catalog"
          className={`transition-all duration-500 scroll-mt-44 md:scroll-mt-48 ${
            !showHeroAndSlider
              ? "opacity-100"
              : "opacity-0 pointer-events-none absolute"
          }`}
        >
          {!showHeroAndSlider && (
            <div className="flex flex-col gap-8">
              {/* Back to home button */}
              <button
                onClick={handleResetToHome}
                className="self-start flex items-center gap-2 text-sm font-black text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest group"
              >
                <span className="w-6 h-6 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                  ←
                </span>
                Всі товари
              </button>

              <Catalog
                categories={categories}
                products={products}
                activeCategoryId={activeCategoryId || undefined}
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. About & Info Sections — always visible */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-12">
        <AboutSection />
        <ContactForm />
        <FAQSection />
      </div>
    </div>
  );
}
