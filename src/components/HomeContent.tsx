"use client";

import { useState } from "react";
import CategoryNav from "./CategoryNav";
import Hero from "./Hero";
import Catalog from "./Catalog";
import AboutSection from "./AboutSection";
import ContactForm from "./ContactForm";
import FAQSection from "./FAQSection";
import { Category, Product } from "@/types/database";

interface HomeContentProps {
  categories: Category[];
  products: Product[];
}

export default function HomeContent({ categories, products }: HomeContentProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories.sort((a, b) => a.order_index - b.order_index)[0]?.id || ""
  );

  return (
    <div className="flex flex-col gap-12 pb-32">
      {/* 1. Category Navigation - Fixed under header */}
      <div className="sticky top-[56px] z-30 bg-[#F3F5F9]/90 backdrop-blur-xl py-3 border-b border-gray-100/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryNav 
            categories={categories} 
            activeCategoryId={activeCategoryId} 
            onSelect={setActiveCategoryId} 
          />
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
