"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Phone, Search, Menu as MenuIcon, MapPin, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import CartDrawer from "./CartDrawer";
import CategoryNav from "./CategoryNav";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-[#F3F5F9] py-4"
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative flex items-center justify-between">
            
            {/* Left Section: Menu & Contacts */}
            <div className="flex items-center gap-4 flex-1">
              <button className="flex flex-col items-center justify-center bg-white h-12 w-20 lg:w-24 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100/50 group">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1C1E]">Меню</span>
              </button>

              <div className="hidden lg:flex items-center gap-4 border-l border-gray-200 pl-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-50 group hover:shadow-md transition-all">
                  <Phone className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                   <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">
                      Щодня: з <span className="text-gray-900">10:00</span> до <span className="text-gray-900">21:30</span>
                   </div>
                   <Link href="tel:+380953727599" className="text-sm lg:text-base font-black text-[#1A1C1E] hover:text-orange-500 transition-colors">
                      (095) 372 75 99
                   </Link>
                </div>
              </div>
            </div>

            {/* Center Section: Logo or Categories */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-full max-w-[400px] lg:max-w-[600px]">
              {/* Logo - visible when NOT scrolled */}
              <div className={`absolute transition-all duration-500 ${
                isScrolled ? "scale-90 opacity-0 pointer-events-none" : "scale-100 opacity-100"
              }`}>
                <Link href="/" className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                     <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1A1C1E] rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 md:w-5 md:h-5 bg-orange-500 rounded-full animate-pulse" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-black tracking-tighter leading-none">FROZEN</span>
                        <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-50 ml-1">Market</span>
                     </div>
                  </div>
                </Link>
              </div>

              {/* Categories Navigation - visible ONLY when scrolled */}
              <div className={`w-full transition-all duration-500 ${
                isScrolled ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 pointer-events-none translate-y-4"
              }`}>
                <CategoryNav isCompact />
              </div>
            </div>

            {/* Right Section: Cart & Profile */}
            <div className="flex items-center justify-end gap-3 flex-1">
              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-3 bg-white px-5 h-12 rounded-2xl shadow-sm hover:shadow-md transition-all font-black border border-gray-100/50 relative"
              >
                <ShoppingCart className="w-4 h-4 text-[#1A1C1E]" />
                <span className="text-sm text-gray-900">{cartItemCount}</span>
                {cartItemCount > 0 && (
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                )}
              </button>

              {/* Profile */}
              <Link href="/profile" className="flex items-center justify-center bg-[#1A1C1E] w-12 h-12 rounded-2xl shadow-sm hover:shadow-md transition-all text-white hover:bg-black">
                <User className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
