"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search as SearchIcon, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/store/cart";
import CartDrawer from "./CartDrawer";
import CategoryNav from "./CategoryNav";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useCategoryStore } from "@/store/category";
import Search from "./Search";
import { SITE_CONFIG } from "@/constants/site";


export default function Header() {
  const { setActiveCategoryId } = useCategoryStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const supabase = createClient();
    
    // Initial user check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 75);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-[#F3F5F9] py-4"
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 lg:h-20 transition-all duration-300">
            
            {/* Left Section: Logo */}
            <div className="shrink-0 flex items-center">
               <Link href="/" onClick={() => setActiveCategoryId('')} className="group flex items-center gap-3">
                  <div className={`transition-all duration-500 rounded-full flex items-center justify-center p-1 border-2 border-[#1A1C1E]/5 group-hover:border-orange-500/20 ${
                    isScrolled ? "bg-[#1A1C1E] w-10 h-10 shadow-lg" : "bg-white w-12 h-12 lg:w-14 lg:h-14 shadow-sm"
                  }`}>
                    <div className="w-5 h-5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                  </div>
                  <div className={`flex flex-col transition-all duration-500 ${isScrolled ? "hidden sm:flex" : "flex"}`}>
                    <span className={`font-black tracking-tighter leading-none transition-all text-[#1A1C1E] group-hover:text-orange-500 ${isScrolled ? "text-xl" : "text-2xl md:text-3xl"}`}>
                      {SITE_CONFIG.shortName}
                    </span>
                    {!isScrolled && (
                      <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30 ml-1 mt-1">{SITE_CONFIG.tagline}</span>
                    )}
                  </div>
               </Link>
            </div>

            {/* Middle Section: Navigation (Only on scroll) or Search (Regular) */}
            <div className={`flex-1 min-w-0 transition-all duration-300 flex items-center px-2 lg:px-6`}>
              {isScrolled ? (
                <div className="w-full animate-in fade-in duration-300">
                  <CategoryNav isCompact />
                </div>
              ) : (
                <div className="w-full flex justify-center animate-in fade-in duration-300">
                  <Search />
                </div>
              )}
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center justify-end gap-2 lg:gap-4 shrink-0">
              {/* Desktop Contacts - visible when NOT scrolled */}
              {!isScrolled && (
                <div className="hidden xl:flex flex-col items-end border-r border-gray-100 pr-4 mr-2">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60 italic">Замовити:</span>
                   <Link href={`tel:${SITE_CONFIG.contacts.phoneRaw}`} className="text-base font-black text-[#1A1C1E] hover:text-orange-500 transition-colors tracking-tighter">
                      {SITE_CONFIG.contacts.phoneDisplay}
                   </Link>
                </div>
              )}

              {/* Admin Access / Admin Label */}
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`flex items-center gap-2 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-orange-500 hover:scale-[1.03] active:scale-95 transition-all font-black text-[10px] uppercase tracking-wider py-4 ${
                    isScrolled ? "px-4" : "px-6"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
                  <span className={`${isScrolled ? "hidden lg:inline" : "inline"}`}>Адмін-панель</span>
                </Link>
              )}

              {/* Cart - only for non-admin users */}
              {!isAdmin && (
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className={`flex items-center bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all font-black border border-gray-50/50 relative px-5 h-12 lg:h-14 gap-3 group`}
                >
                  <div className="relative">
                      <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-[#1A1C1E] group-hover:scale-110 transition-transform" />
                      {cartItemCount > 0 && (
                          <span className="absolute -top-3 -right-3 min-w-[20px] h-5 px-1 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-orange-500/50 border-2 border-white">
                              {cartItemCount}
                          </span>
                      )}
                  </div>
                  <span className="hidden sm:inline text-xs lg:text-sm text-gray-900 uppercase tracking-[0.1em]">Кошик</span>
                </button>
              )}


              {/* Profile - only for non-admin users */}
              {!isAdmin && (
                <Link href="/profile" className="flex items-center justify-center bg-gray-50/50 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl shadow-inner border border-gray-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-[#1A1C1E] transition-transform group-hover:scale-110" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {!isAdmin && (
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
}
