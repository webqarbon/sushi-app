"use client";

import Image from "next/image";
import { Product } from "@/types/database";
import { useCartStore } from "@/store/cart";
import { Plus, Star } from "lucide-react";
import { useState } from "react";
import ReviewPopup from "./ReviewPopup";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";

type CardVariant = "full" | "compact" | "catalog";

export default function ProductCard({ product, compact = false, variant }: { product: Product; compact?: boolean; variant?: CardVariant }) {
  const mode = variant ?? (compact ? "compact" : "full");
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const bonusUah = (product.price * product.bonus_percent) / 100;
  
  const weightInfo = product.description?.match(/\d+\s*(г|кг|шт|мл|л)/gi)?.join(" | ") || "";

  return (
    <>
      <div className={`group flex flex-col bg-white shadow-sm hover:shadow-premium transition-all duration-500 border border-transparent hover:border-white h-full ${
        mode === "compact" ? "rounded-xl sm:rounded-2xl p-1.5" :
        mode === "catalog" ? "rounded-2xl p-2" : "rounded-[2.5rem] p-2"
      }`}>
        {/* Image Area */}
        <div className={`relative aspect-square bg-[#F9FAFB] overflow-hidden ${
          mode === "compact" ? "rounded-lg sm:rounded-xl" : mode === "catalog" ? "rounded-xl" : "rounded-[2rem]"
        }`}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
              Немає фото
            </div>
          )}
          
          {/* Rating Badge */}
          <div 
            onClick={async () => {
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                return toast.error("Ви повинні увійти, щоб залишити відгук");
              }
              setShowReviewPopup(true);
            }}
            className={`absolute bg-white/90 backdrop-blur-md text-[#1A1C1E] flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg border border-white/50 group/rating ${
              mode === "compact" ? "bottom-2 left-2 px-2.5 py-1.5 rounded-lg text-[10px]" :
              mode === "catalog" ? "bottom-2 left-2 px-2.5 py-1.5 rounded-lg text-[10px]" : "bottom-5 left-5 px-4 py-2 rounded-2xl gap-2"
            }`}
          >
            <Star className={`${mode !== "full" ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} ${(product.average_rating || 0) > 0 ? "fill-orange-400 text-orange-400" : "text-gray-300"} group-hover/rating:scale-110 transition-transform`} />
            <span className={mode !== "full" ? "text-[10px] font-black" : "text-[11px] font-black"}>
              {(product.average_rating || 0) > 0 ? (product.average_rating as number).toFixed(1) : "—"}
            </span>
            <span className={`font-bold text-gray-400 border-l border-gray-200 ${mode !== "full" ? "text-[10px] pl-1.5" : "text-[10px] pl-2"}`}>
              {product.reviews_count || 0}
            </span>
          </div>

          {/* Bonus Badge */}
          <div className={`absolute bg-orange-400 text-white rounded-full font-black uppercase shadow-xl shadow-orange-400/20 backdrop-blur-sm ${
            mode === "compact" ? "top-2 right-2 px-2.5 py-1 text-[9px] tracking-wider" :
            mode === "catalog" ? "top-2 right-2 px-2.5 py-1 text-[9px] tracking-wider" : "top-5 right-5 px-5 py-2 text-[10px] tracking-widest"
          }`}>
            +{bonusUah.toFixed(0)} бонуси
          </div>
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-1 text-center ${
          mode === "compact" ? "p-3 sm:p-4" : mode === "catalog" ? "p-4" : "p-7"
        }`}>
          {/* Characteristics */}
          <div className={`text-gray-400 font-black uppercase opacity-70 ${
            mode === "compact" ? "text-[10px] tracking-wider mb-1.5" : mode === "catalog" ? "text-[10px] tracking-wider mb-2" : "text-[10px] tracking-widest mb-4"
          }`}>
            {weightInfo}
          </div>

          <h3 className={`font-black text-[#1A1C1E] leading-[1.2] group-hover:text-orange-500 transition-colors duration-300 ${
            mode === "compact" ? "text-base sm:text-lg mb-2 px-1" : mode === "catalog" ? "text-base sm:text-lg mb-2 px-1" : "text-[22px] mb-4 px-2"
          }`}>
            {product.name}
          </h3>
          
          <p className={`text-gray-400 font-medium line-clamp-2 leading-relaxed opacity-80 ${
            mode === "compact" ? "text-xs mb-4 px-1 min-h-[32px]" : mode === "catalog" ? "text-xs mb-3 px-1 min-h-[28px]" : "text-sm mb-8 px-3 min-h-[40px]"
          }`}>
            {product.description}
          </p>

          {/* Footer: Price and Add Button */}
          <div className={`mt-auto flex items-center justify-between bg-gray-50/80 rounded-xl border border-gray-100/50 ${
            mode === "compact" ? "p-1.5 pl-4" : mode === "catalog" ? "p-2 pl-4" : "rounded-[1.75rem] p-2 pl-7"
          }`}>
            <div className="flex flex-col items-start">
              <span className={`font-black text-[#1A1C1E] tracking-tight ${
                mode === "full" ? "text-2xl" : "text-lg"
              }`}>{product.price.toFixed(0)} <span className={`opacity-70 ${mode === "full" ? "text-lg" : "text-sm"}`}>₴</span></span>
            </div>
            
            <button
              onClick={() => addItem(product)}
              className={`flex items-center justify-center bg-white text-[#1A1C1E] rounded-xl shadow-md hover:bg-orange-400 hover:text-white transition-all duration-300 active:scale-90 hover:shadow-lg hover:shadow-orange-400/30 ${
                mode === "compact" ? "w-10 h-10 sm:w-11 sm:h-11" : mode === "catalog" ? "w-10 h-10 sm:w-11 sm:h-11" : "w-14 h-14 rounded-2xl"
              }`}
              aria-label="Додати в кошик"
            >
              <Plus className={mode !== "full" ? "w-5 h-5 sm:w-6 sm:h-6" : "w-7 h-7"} />
            </button>
          </div>
        </div>
      </div>

      {showReviewPopup && (
        <ReviewPopup 
          productId={product.id} 
          productName={product.name} 
          onClose={() => setShowReviewPopup(false)} 
        />
      )}
    </>
  );
}
