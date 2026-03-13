"use client";

import { useState, useTransition } from "react";
import { ShoppingBag, Package, Star, TrendingUp, RefreshCw } from "lucide-react";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";
import { getDashboardStats } from "@/app/actions/admin";

interface DashboardData {
  productCount: number;
  categoryCount: number;
  reviewCount: number;
  allOrders: any[];
}

export default function AdminDashboardClient({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = async () => {
    startTransition(async () => {
      const updatedData = await getDashboardStats();
      setData(updatedData);
    });
  };

  const stats = [
    { label: "Товари", value: data.productCount, icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Категорії", value: data.categoryCount, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { label: "Відгуки", value: data.reviewCount, icon: Star, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Замовлення", value: data.allOrders.length, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Дашборд</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Основна статистика вашого магазину</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isPending}
          className="flex items-center gap-2 bg-white border border-slate-100 hover:border-orange-500 hover:text-orange-500 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
           {isPending ? "Оновлення..." : "Оновити дані"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50/50 blur-2xl -z-10 rounded-full" />
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 border border-white shadow-sm group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`transition-opacity duration-300 ${isPending ? "opacity-50" : "opacity-100"}`}>
        <AdminDashboardCharts data={data.allOrders} />
      </div>
    </div>
  );
}
