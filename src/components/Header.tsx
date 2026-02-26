"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Phone, MapPin, Search, Menu as MenuIcon, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F3F5F9]/80 backdrop-blur-md pt-4 pb-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            
            {/* Menu Button */}
            <button className="flex items-center gap-3 bg-white px-6 h-14 rounded-2xl shadow-sm hover:shadow-md transition-all font-black text-xs uppercase tracking-widest text-[#1A1C1E]">
              <MenuIcon className="w-5 h-5" />
              <span className="hidden sm:inline">МЕНЮ</span>
            </button>

            {/* Phone Button */}
            <Link href="tel:+38000000000" className="flex items-center justify-center bg-white w-14 h-14 rounded-2xl shadow-sm hover:shadow-md transition-all text-[#1A1C1E]">
              <Phone className="w-5 h-5" />
            </Link>

            {/* City Selector */}
            <div className="flex-1 flex items-center bg-white h-14 px-5 rounded-2xl shadow-sm border-l-4 border-orange-400">
               <MapPin className="w-4 h-4 text-orange-400 mr-3" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Ваше місто:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-[#1A1C1E]">ДНІПРО</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
               </div>
            </div>

            {/* Search */}
            <button className="flex items-center justify-center bg-white w-14 h-14 rounded-2xl shadow-sm hover:shadow-md transition-all text-[#1A1C1E]">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 bg-white px-6 h-14 rounded-2xl shadow-sm hover:shadow-md transition-all font-black text-gray-400"
            >
              <ShoppingCart className="w-5 h-5 text-[#1A1C1E]" />
              <span className="text-lg text-gray-400">{cartItemCount}</span>
            </button>

            {/* Profile Link (Added to match previous functionality but styled like buttons) */}
            <Link href="/profile" className="flex items-center justify-center bg-white w-14 h-14 rounded-2xl shadow-sm hover:shadow-md transition-all text-[#1A1C1E]">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
