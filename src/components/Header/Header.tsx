"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import CartDrawer from "../CartDrawer";
import HeaderTopBar from "./HeaderTopBar";
import CategorySection from "./CategorySection";

export default function Header() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const showCategories = pathname === "/";

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => (y > 100 ? true : y < 50 ? false : prev));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = user?.user_metadata?.role === "admin";

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_1px_3px_rgba(0,0,0,0.04)]" : ""
        }`}
      >
        <HeaderTopBar
          isAdmin={isAdmin}
          compact={isScrolled}
          onCartClick={() => setIsCartOpen(true)}
          isMobileSearchOpen={isMobileSearchOpen}
          onMobileSearchToggle={() => setIsMobileSearchOpen((o) => !o)}
        />

        {!isAdmin && showCategories && (
          <div
            className={`transition-all duration-300 ease-out ${
              isScrolled ? "max-h-0 opacity-0 overflow-hidden" : "max-h-40 opacity-100 overflow-visible"
            }`}
          >
            <CategorySection />
          </div>
        )}
      </header>

      {!isAdmin && (
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
}
