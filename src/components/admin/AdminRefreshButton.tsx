"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function AdminRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      title="Оновити дані"
      className="flex items-center gap-2 h-10 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50 transition-all active:scale-95 disabled:opacity-50 group"
    >
      <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isPending ? "animate-spin" : "group-hover:rotate-180"}`} />
      <span className="hidden sm:inline font-bold text-[10px] uppercase tracking-wider">
        {isPending ? "Оновлення..." : "Оновити"}
      </span>
    </button>
  );
}
