"use client";

import { ShoppingBag, Package, Star, TrendingUp } from "lucide-react";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";

interface DashboardData {
  productCount: number;
  categoryCount: number;
  reviewCount: number;
  allOrders: any[];
}

export default function AdminDashboardClient({ initialData }: { initialData: DashboardData }) {
  const stats = [
    { label: "Товари", value: initialData.productCount, icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Категорії", value: initialData.categoryCount, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { label: "Відгуки", value: initialData.reviewCount, icon: Star, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Замовлення", value: initialData.allOrders.length, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Дашборд</h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Основна статистика вашого магазину</p>
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

      <AdminDashboardCharts data={initialData.allOrders} />
    </div>
  );
}
