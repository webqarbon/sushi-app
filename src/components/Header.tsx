"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, LayoutDashboard } from "lucide-react";
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
        isScrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 py-1" : "bg-[#F3F5F9] py-3"
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-14 lg:h-16 transition-all duration-300">
            
            {/* Left Section: Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/" onClick={() => setActiveCategoryId('')} className="group flex items-center gap-2.5">
                <div className={`transition-all duration-500 rounded-2xl flex items-center justify-center border border-white bg-white shadow-premium group-hover:border-orange-500/20 ${
                  isScrolled ? "w-10 h-10" : "w-12 h-12 lg:w-14 lg:h-14"
                }`}>
                  <div className="w-5 h-5 bg-orange-500 rounded-lg shadow-[0_4px_10px_rgba(249,115,22,0.3)] transition-all group-hover:rotate-12 group-active:scale-90" />
                </div>
                <div className={`flex flex-col transition-all duration-500 ${isScrolled ? "hidden sm:flex" : "flex"}`}>
                  <span className={`font-black tracking-tighter leading-none transition-all text-[#1A1C1E] group-hover:text-orange-500 ${isScrolled ? "text-lg" : "text-xl md:text-2xl"}`}>
                    {SITE_CONFIG.shortName}
                  </span>
                  {!isScrolled && (
                    <span className="text-[9px] font-black tracking-[0.3em] uppercase opacity-30 ml-0.5 mt-0.5">{SITE_CONFIG.tagline}</span>
                  )}
                </div>
              </Link>
            </div>

            {/* Middle Section: Search */}
            <div className="flex-1 min-w-0 flex items-center justify-center max-w-2xl mx-auto px-2 lg:px-6">
              <Search />
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center justify-end gap-2 lg:gap-4 shrink-0">
              {/* Desktop Contacts */}
              <div className="hidden xl:flex flex-col items-end pr-4 mr-2 border-r border-gray-200/50">
                 <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Підтримка:</span>
                 <Link href={`tel:${SITE_CONFIG.contacts.phoneRaw}`} className="text-[13px] font-black text-[#1A1C1E] hover:text-orange-500 transition-colors tracking-tight">
                    {SITE_CONFIG.contacts.phoneDisplay}
                 </Link>
              </div>

              {/* Admin Access */}
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 bg-[#1A1C1E] text-white rounded-xl shadow-lg hover:bg-orange-600 transition-all font-bold text-[10px] uppercase tracking-wider h-11 px-5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Адмін</span>
                </Link>
              )}

              {/* Cart */}
              {!isAdmin && (
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className={`flex items-center bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 relative h-11 px-4 gap-2.5 group`}
                >
                  <div className="relative">
                      <ShoppingCart className="w-4 h-4 text-[#1A1C1E] transition-transform group-hover:scale-110" />
                      {cartItemCount > 0 && (
                          <span className="absolute -top-2.5 -right-2.5 min-w-[18px] h-4.5 px-1 bg-orange-500 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-orange-500/30 border-2 border-white">
                              {cartItemCount}
                          </span>
                      )}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-gray-900 uppercase tracking-wider">Кошик</span>
                </button>
              )}

              {/* Profile */}
              {!isAdmin && (
                <Link href="/profile" className="flex items-center justify-center bg-white w-11 h-11 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden">
                  <User className="w-4 h-4 text-[#1A1C1E] transition-transform group-hover:scale-110" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        {!isAdmin && (
          <div className="w-full mt-1.5 animate-in fade-in slide-in-from-top-1 duration-500">
             <CategoryNav />
          </div>
        )}
      </header>

      {!isAdmin && (
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
}
