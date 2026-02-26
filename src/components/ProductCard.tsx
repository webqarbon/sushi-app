"use client";

import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types/database";
import { useCartStore } from "@/store/cart";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const bonusUah = (product.price * product.bonus_percent) / 100;
  
  return (
    <div className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image Area with Badge */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            Немає фото
          </div>
        )}
        
        {/* Bonus Badge */}
        <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          +{bonusUah.toFixed(1)} бонусів
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 lg:p-6">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-700">{product.fake_rating}</span>
          <span className="text-xs text-gray-400">({product.fake_reviews_count} відгуків)</span>
        </div>

        <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900">{product.price.toFixed(0)} ₴</span>
          </div>
          
          <button
            onClick={() => addItem(product)}
            className="flex items-center justify-center p-3 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl sm:rounded-xl font-semibold transition-colors active:scale-95"
            aria-label="Додати в кошик"
          >
            <ShoppingCart className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">В кошик</span>
          </button>
        </div>
      </div>
    </div>
  );
}
