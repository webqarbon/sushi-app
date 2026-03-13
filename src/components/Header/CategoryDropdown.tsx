"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Category } from "@/types/database";
import { CATEGORY_ICON_MAP } from "./categoryIcons";
import { Utensils } from "lucide-react";

interface CategoryDropdownProps {
  categories: Category[];
  activeCategoryId: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function CategoryDropdown({
  categories,
  activeCategoryId,
  onSelect,
  isOpen,
  onToggle,
  onClose,
}: CategoryDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (isOpen && containerRef.current && !containerRef.current.contains(target)) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onClose]);

  const sortedCategories = [...categories].sort((a, b) => a.order_index - b.order_index);

  return (
    <div ref={containerRef} className="md:hidden relative">
      <button
        onClick={onToggle}
        type="button"
        className="flex items-center gap-2 w-full min-h-[44px] px-4 py-3 rounded-xl border border-slate-100 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors touch-manipulation"
      >
        <span>Категорії</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-100 shadow-lg overflow-hidden z-[60] max-h-[70vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="p-2">
            {sortedCategories.map((cat) => {
              const Icon = CATEGORY_ICON_MAP[cat.slug] || Utensils;
              const isActive = activeCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelect(cat.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-sm">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
