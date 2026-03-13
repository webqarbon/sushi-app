"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useCategoryStore } from "@/store/category";

export default function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, setCategories } = useCategoryStore();

  useEffect(() => {
    if (categories.length > 0) return;
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("order_index", { ascending: true })
      .then(({ data }) => {
        if (data?.length) setCategories(data);
      });
  }, [categories.length, setCategories]);

  return <>{children}</>;
}
