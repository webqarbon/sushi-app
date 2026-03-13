"use client";

import Link from "next/link";
import { ShoppingCart, User, LayoutDashboard, Search, Phone } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { SITE_CONFIG } from "@/constants/site";
import { useEffect, useRef, useState } from "react";

interface HeaderActionsProps {
  isAdmin: boolean;
  onCartClick: () => void;
  onSearchClick: () => void;
}

export default function HeaderActions({
  isAdmin,
  onCartClick,
  onSearchClick,
}: HeaderActionsProps) {
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const prevCount = useRef(cartItemCount);
  const [badgePulse, setBadgePulse] = useState(false);

  useEffect(() => {
    if (cartItemCount > prevCount.current) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 500);
      prevCount.current = cartItemCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartItemCount;
  }, [cartItemCount]);

  return (
    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
      {/* Mobile search toggle */}
      <button
        onClick={onSearchClick}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-orange-500 hover:bg-slate-50 transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Contact — desktop */}
      <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-100">
        <a
          href={`tel:${SITE_CONFIG.contacts.phoneRaw}`}
          className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
            <Phone className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Підтримка
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {SITE_CONFIG.contacts.phoneDisplay}
            </span>
          </div>
        </a>
      </div>

      {/* Admin */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2 bg-slate-900 text-white rounded-xl px-4 h-10 font-semibold text-xs uppercase tracking-wider hover:bg-orange-500 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Адмін</span>
        </Link>
      )}

      {/* Cart */}
      {!isAdmin && (
        <button
          data-cart-target
          onClick={onCartClick}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider hover:bg-orange-500 transition-colors relative"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Кошик</span>
          {cartItemCount > 0 && (
            <span
              className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white transition-transform ${
                badgePulse ? "animate-cart-badge-pulse" : ""
              }`}
            >
              {cartItemCount}
            </span>
          )}
        </button>
      )}

      {/* Profile */}
      {!isAdmin && (
        <Link
          href="/profile"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-orange-500 hover:bg-slate-50 transition-colors"
        >
          <User className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
