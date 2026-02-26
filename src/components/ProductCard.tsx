"use client";

import Image from "next/image";
import { Product } from "@/types/database";
import { useCartStore } from "@/store/cart";
import { Plus } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const bonusUah = (product.price * product.bonus_percent) / 100;
  
  // Weights and counts are usually in description or we can mock them for the design
  // Let's try to extract from description or use placeholder if not found
  const weightInfo = product.description?.match(/\d+\s*(г|шт)/g)?.join(" | ") || "32 шт | 1355 г";

  return (
    <div className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-premium transition-all duration-500 border border-transparent hover:border-white p-2">
      {/* Image Area */}
      <div className="relative aspect-square bg-[#F9FAFB] rounded-[2rem] overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            Немає фото
          </div>
        )}
        
        {/* Bonus Badge */}
        <div className="absolute top-5 right-5 bg-orange-400 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-400/20 backdrop-blur-sm">
          +{bonusUah.toFixed(0)} бонуси
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-7 text-center">
        {/* Characteristics */}
        <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">
          {weightInfo}
        </div>

        <h3 className="font-black text-[22px] text-[#1A1C1E] leading-[1.2] mb-4 px-2 group-hover:text-orange-500 transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-400 font-medium mb-8 line-clamp-2 px-3 leading-relaxed opacity-80">
          {product.description}
        </p>

        {/* Footer: Price and Add Button */}
        <div className="mt-auto flex items-center justify-between bg-gray-50/80 rounded-[1.75rem] p-2 pl-7 border border-gray-100/50">
          <div className="flex flex-col items-start">
            <span className="text-2xl font-black text-[#1A1C1E] tracking-tight">{product.price.toFixed(0)} <span className="text-lg opacity-70">₴</span></span>
          </div>
          
          <button
            onClick={() => addItem(product)}
            className="flex items-center justify-center w-14 h-14 bg-white text-[#1A1C1E] rounded-2xl shadow-md hover:bg-orange-400 hover:text-white transition-all duration-300 active:scale-90 hover:shadow-lg hover:shadow-orange-400/30"
            aria-label="Додати в кошик"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
