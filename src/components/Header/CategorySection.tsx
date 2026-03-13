"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useCategoryStore } from "@/store/category";
import { Category } from "@/types/database";
import { CATEGORY_ICON_MAP } from "./categoryIcons";
import { Utensils, ChevronLeft, ChevronRight } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";

interface CategorySectionProps {
  categories?: Category[];
}

const SCROLL_DURATION = 350;
const SCROLL_TOLERANCE = 2;
const END_SPACER_WIDTH = 64; // px extra after last item so last category is fully visible

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export default function CategorySection({ categories: propsCategories }: CategorySectionProps) {
  const {
    categories: storeCategories,
    activeCategoryId,
    setActiveCategoryId,
  } = useCategoryStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const categories = propsCategories || storeCategories;

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.order_index - b.order_index);
  }, [categories]);

  const updateScrollState = useCallback(() => {
    if (isAnimatingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    setCanScrollLeft(scrollLeft > SCROLL_TOLERANCE);
    setCanScrollRight(scrollLeft < maxScroll - SCROLL_TOLERANCE);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scheduleUpdate = () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateScrollState();
          rafIdRef.current = null;
        });
      });
    };

    scheduleUpdate();
    const fallbackTimer = setTimeout(scheduleUpdate, 150);

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(el, { childList: true, subtree: true });

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      clearTimeout(fallbackTimer);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [sortedCategories.length, updateScrollState]);

  const scrollTo = useCallback(
    (targetScroll: number) => {
      const el = scrollRef.current;
      if (!el) return;

      const startScroll = el.scrollLeft;
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const clamped = Math.max(0, Math.min(targetScroll, maxScroll));

      if (Math.abs(clamped - startScroll) < 1) return;

      isAnimatingRef.current = true;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / SCROLL_DURATION, 1);
        const eased = easeOutCubic(progress);
        el.scrollLeft = startScroll + (clamped - startScroll) * eased;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimatingRef.current = false;
          updateScrollState();
        }
      };

      requestAnimationFrame(animate);
    },
    [updateScrollState]
  );

  const scrollLeft = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !canScrollLeft) return;

    const step = el.clientWidth * 0.7;
    const target = Math.max(0, el.scrollLeft - step);
    scrollTo(target);
  }, [canScrollLeft, scrollTo]);

  const scrollRight = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !canScrollRight) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const step = el.clientWidth * 0.7;
    const target = Math.min(maxScroll, el.scrollLeft + step);
    scrollTo(target);
  }, [canScrollRight, scrollTo]);

  const handleCategorySelect = useCallback(
    (id: string) => {
      setActiveCategoryId(id);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [setActiveCategoryId]
  );

  return (
    <div className="border-t border-slate-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="md:hidden py-3">
          <CategoryDropdown
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={setActiveCategoryId}
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen((o) => !o)}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>

        <div className="hidden md:block py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              aria-label="Прокрутити категорії вліво"
              className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border transition-opacity ${
                canScrollLeft
                  ? "bg-white border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 cursor-pointer"
                  : "bg-transparent border-transparent text-slate-300 cursor-default opacity-0 pointer-events-none"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={scrollRef}
              className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden py-1 hide-scrollbar"
              style={{ scrollBehavior: "auto" }}
              role="region"
              aria-label="Категорії"
            >
              <div className="flex gap-2 w-max pr-2">
                {sortedCategories.map((cat) => {
                  const Icon = CATEGORY_ICON_MAP[cat.slug] || Utensils;
                  const isActive = activeCategoryId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shrink-0 transition-colors ${
                        isActive
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
                    </button>
                  );
                })}
                <div
                  className="shrink-0"
                  style={{ width: END_SPACER_WIDTH }}
                  aria-hidden
                />
              </div>
            </div>

            <button
              type="button"
              onClick={scrollRight}
              disabled={!canScrollRight}
              aria-label="Прокрутити категорії вправо"
              className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border transition-opacity ${
                canScrollRight
                  ? "bg-white border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 cursor-pointer"
                  : "bg-transparent border-transparent text-slate-300 cursor-default opacity-0 pointer-events-none"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
