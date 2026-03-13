"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminRealtimeReloader() {
  const router = useRouter();
  const supabase = createClient();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const handleChange = () => {
      setLastUpdated(new Date());
      router.refresh();
    };

    const channel = supabase
      .channel("admin-global-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, handleChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, handleChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, handleChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, handleChange)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  useEffect(() => {
    if (!lastUpdated) return;
    const t = setTimeout(() => setLastUpdated(null), 3000);
    return () => clearTimeout(t);
  }, [lastUpdated]);

  if (!lastUpdated) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-green-500/90 text-white text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-300">
      Оновлено {lastUpdated.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </div>
  );
}
