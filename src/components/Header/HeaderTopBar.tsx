"use client";

import Link from "next/link";
import { useCategoryStore } from "@/store/category";
import { SITE_CONFIG } from "@/constants/site";
import SearchBar from "./SearchBar";
import HeaderActions from "./HeaderActions";

interface HeaderTopBarProps {
  isAdmin: boolean;
  compact?: boolean;
  onCartClick: () => void;
  isMobileSearchOpen: boolean;
  onMobileSearchToggle: () => void;
}

export default function HeaderTopBar({
  isAdmin,
  compact = false,
  onCartClick,
  isMobileSearchOpen,
  onMobileSearchToggle,
}: HeaderTopBarProps) {
  const { setActiveCategoryId } = useCategoryStore();

  return (
    <div className="border-b border-slate-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`flex items-center justify-between gap-4 transition-all duration-300 ${
            compact ? "h-14 lg:h-14" : "h-16 lg:h-[72px]"
          }`}
        >
          {/* Logo & Search Container */}
          <div className="flex items-center gap-10 min-w-0 max-w-3xl">
            <Link
              href="/"
              onClick={() => setActiveCategoryId("")}
              className="group flex items-center gap-2.5 shrink-0 animate-logo-float"
            >
              <div
                className={`rounded-xl bg-orange-500 flex items-center justify-center group-hover:bg-orange-600 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-500 ${
                  compact ? "w-8 h-8" : "w-9 h-9"
                }`}
              >
                <span className="w-2 h-2 bg-white rounded-full group-hover:scale-125 transition-transform duration-500" />
              </div>
              <div className="flex flex-col group-hover:translate-x-0.5 transition-transform duration-500">
                <span
                  className={`font-bold text-slate-900 group-hover:text-orange-500 transition-colors whitespace-nowrap ${
                    compact ? "text-base" : "text-lg"
                  }`}
                >
                  {SITE_CONFIG.shortName}
                </span>
                {!compact && (
                  <span className="text-[10px] font-medium tracking-widest uppercase text-slate-400 whitespace-nowrap">
                    {SITE_CONFIG.tagline}
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Search - now anchored to the left near logo */}
            <div className="hidden md:block w-full max-w-sm">
              <SearchBar />
            </div>
          </div>

          {/* Actions */}
          <div className="flex-1 flex items-center justify-end shrink-0">
            <HeaderActions
              isAdmin={isAdmin}
              onCartClick={onCartClick}
              onSearchClick={onMobileSearchToggle}
            />
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Пошук</span>
            <button
              onClick={onMobileSearchToggle}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Закрити
            </button>
          </div>
          <SearchBar onClose={onMobileSearchToggle} />
        </div>
      )}
    </div>
  );
}
