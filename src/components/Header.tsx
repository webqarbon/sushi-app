"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Phone } from "lucide-react";
import { useCartStore } from "@/store/cart";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: "Каталог", href: "/#catalog" },
    { name: "Про нас", href: "/#about" },
    { name: "Контакти", href: "/#consultation" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F3F5F9]/80 backdrop-blur-md py-1.5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left side: Phone */}
            <Link href="tel:+380953727599" className="flex items-center justify-center bg-white w-10 h-10 lg:w-11 lg:h-11 rounded-xl shadow-sm hover:shadow-md transition-all text-[#1A1C1E] group">
              <Phone className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
            </Link>

            {/* Center Navigation: Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-all relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full rounded-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right side: Cart & Profile */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-white px-3 lg:px-5 h-10 lg:h-11 rounded-xl shadow-sm hover:shadow-md transition-all font-black"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-[#1A1C1E]" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-gray-900 text-xs">Кошик</span>
              </button>

              <Link href="/profile" className="flex items-center justify-center bg-white w-10 h-10 lg:w-11 lg:h-11 rounded-xl shadow-sm hover:shadow-md transition-all text-[#1A1C1E] group">
                <User className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
