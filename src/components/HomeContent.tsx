"use client";

import { useState, useEffect, useRef } from "react";
import CategoryNav from "./CategoryNav";
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
  const [isHeaderCategoriesVisible, setIsHeaderCategoriesVisible] = useState(false);
  // null = initial state (show Hero + Slider), string = category selected (show Catalog)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync local state with store (e.g. when reset from Header logo or updated from compact nav)
    if (activeCategoryId === '') {
      setSelectedCategoryId(null);
    } else if (activeCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(activeCategoryId);
    }
  }, [activeCategoryId, selectedCategoryId]);

  useEffect(() => {
    setCategories(categories);

    const handleScroll = () => {
      setIsHeaderCategoriesVisible(window.scrollY > 75);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, setCategories]);

  const handleCategorySelect = (id: string) => {
    setActiveCategoryId(id);
    setSelectedCategoryId(id);
    // Scroll to catalog smoothly
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleResetToHome = () => {
    setSelectedCategoryId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showHeroAndSlider = selectedCategoryId === null;

  return (
    <div className="flex flex-col gap-0 pb-32">

      {/* 1. Category Navigation — sticky under header */}
      <div
        className={`sticky top-[72px] lg:top-[80px] z-30 bg-[#F3F5F9] py-3 md:py-4 border-b border-gray-100/50 transition-all duration-300 ${
          isHeaderCategoriesVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryNav onSelect={handleCategorySelect} />
        </div>
      </div>

      {/* 2. Hero + Slider OR Catalog — animated switch */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* HERO SECTION — visible only on home state */}
        <div
          className={`transition-all duration-500 ${
            showHeroAndSlider
              ? "opacity-100 max-h-[1200px] mb-8"
              : "opacity-0 max-h-0 overflow-hidden pointer-events-none mb-0"
          }`}
        >
          <Hero />
        </div>

        {/* PRODUCT SLIDER — visible only on home state */}
        <div
          className={`transition-all duration-500 delay-100 ${
            showHeroAndSlider
              ? "opacity-100 max-h-[2000px] mb-12"
              : "opacity-0 max-h-0 overflow-hidden pointer-events-none mb-0"
          }`}
        >
          <ProductSlider products={products} />
        </div>

        {/* CATALOG — visible when category selected */}
        <div
          ref={catalogRef}
          id="catalog"
          className={`transition-all duration-500 ${
            !showHeroAndSlider
              ? "opacity-100"
              : "opacity-0 pointer-events-none absolute"
          }`}
        >
          {!showHeroAndSlider && (
            <div className="flex flex-col gap-10">
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
                activeCategoryId={selectedCategoryId || undefined}
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. About & Info Sections — always visible */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mt-16">
        <AboutSection />
        <ContactForm />
        <FAQSection />
      </div>
    </div>
  );
}
