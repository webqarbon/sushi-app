import { createClient } from "@supabase/supabase-js";
import { ShoppingBag, Package, Star, TrendingUp, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default async function AdminDashboard() {
  const supabaseAdmin = getAdminClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [{ count: productCount }, { count: categoryCount }, { count: reviewCount }, { data: allOrders }] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('created_at, total_price').gte('created_at', thirtyDaysAgo.toISOString()).order('created_at', { ascending: true })
  ]);

  const stats = [
    { label: "Товари", value: productCount || 0, icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Категорії", value: categoryCount || 0, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { label: "Відгуки", value: reviewCount || 0, icon: Star, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Замовлення", value: allOrders?.length || 0, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
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

      <AdminDashboardCharts data={allOrders || []} />
    </div>
  );
}
