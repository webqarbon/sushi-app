"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminRealtimeReloader() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to all changes in the tables we care about
    const channel = supabase
      .channel("admin-global-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => router.refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => router.refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => router.refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () => router.refresh())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return null; // This component doesn't render anything
}
