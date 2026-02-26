"use client";

import { useState } from "react";
import CategoryNav from "./CategoryNav";
import Hero from "./Hero";
import Catalog from "./Catalog";
import AboutSection from "./AboutSection";
import ContactForm from "./ContactForm";
import FAQSection from "./FAQSection";
import { Category, Product } from "@/types/database";
import { useCategoryStore } from "@/store/category";
import { useEffect } from "react";

interface HomeContentProps {
  categories: Category[];
  products: Product[];
}

export default function HomeContent({ categories, products }: HomeContentProps) {
  const { activeCategoryId, setActiveCategoryId, setCategories } = useCategoryStore();
  const [isHeaderCategoriesVisible, setIsHeaderCategoriesVisible] = useState(false);

  useEffect(() => {
    setCategories(categories);
    if (!activeCategoryId && categories.length > 0) {
      setActiveCategoryId(categories.sort((a, b) => a.order_index - b.order_index)[0]?.id);
    }

    const handleScroll = () => {
      setIsHeaderCategoriesVisible(window.scrollY > 400); // Approximate height where categories reach header
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, setCategories, activeCategoryId, setActiveCategoryId]);

  return (
    <div className="flex flex-col gap-12 pb-32">
      {/* 1. Category Navigation - Fixed under header */}
      <div className={`sticky top-[72px] lg:top-[80px] z-30 bg-[#F3F5F9]/80 backdrop-blur-xl py-6 md:py-8 border-b border-gray-100/50 transition-all duration-300 ${
        isHeaderCategoriesVisible ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryNav />
        </div>
      </div>

      {/* 2. Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
      </div>
      
      {/* 3. Catalog Section */}
      <section id="catalog" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Catalog 
          categories={categories} 
          products={products} 
          activeCategoryId={activeCategoryId}
        />
      </section>

      {/* 4. About & Info Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <AboutSection />
        <ContactForm />
        <FAQSection />
      </div>
    </div>
  );
}
