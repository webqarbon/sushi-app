"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cart";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-blue-600">
              FROZ<span className="text-sky-400">EN</span>
            </span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link href="/#catalog" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Каталог
            </Link>
            <Link href="/#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Про нас
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/profile" className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
              <User className="h-5 w-5" />
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
