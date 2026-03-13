import { createClient } from "@supabase/supabase-js";
import { ShoppingBag, Package, Star, TrendingUp, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default async function AdminDashboard() {
  const supabaseAdmin = getAdminClient();

  const [{ count: productCount }, { count: categoryCount }, { count: reviewCount }, { data: recentOrders }] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(5)
  ]);

  const [{ data: approvedReviews }, { data: pendingReviews }] = await Promise.all([
      supabaseAdmin.from('reviews').select('*').eq('status', 'approved'),
      supabaseAdmin.from('reviews').select('*').eq('status', 'pending')
  ]);

  const stats = [
    { label: "Товари", value: productCount || 0, icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Категорії", value: categoryCount || 0, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { label: "Відгуки", value: reviewCount || 0, icon: Star, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Замовлення", value: recentOrders?.length || 0, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase">Останні замовлення</h3>
                <ShoppingBag className="w-5 h-5 text-slate-200" />
            </div>
            <div className="space-y-4 flex-1">
                {recentOrders && recentOrders.length > 0 ? recentOrders.map((order: { id: string; created_at: string; total_price: number; profiles?: { full_name?: string } | null }) => (
                    <div key={order.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">
                            <span className="font-black text-[10px] text-orange-500">#{order.id.slice(0, 4)}</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{order.profiles?.full_name || "Гість"}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                <Clock className="w-3 h-3 text-slate-300" />
                                {new Date(order.created_at).toLocaleString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        <div className="text-base font-black text-slate-900 tracking-tighter">{SITE_CONFIG.currency}{order.total_price}</div>
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8 opacity-40">
                         <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                            <ShoppingBag className="w-7 h-7" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest">Замовлень поки немає</p>
                    </div>
                )}
            </div>
        </div>

        {/* Reviews Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase">Менеджмент відгуків</h3>
                <Star className="w-5 h-5 text-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex flex-col items-center">
                    <span className="text-xl font-black text-green-600 leading-none">{approvedReviews?.length || 0}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-500 mt-1">Схвалено</span>
                </div>
                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center animate-pulse">
                    <span className="text-xl font-black text-orange-600 leading-none text-center flex flex-col items-center">{pendingReviews?.length || 0}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 mt-1">Нові</span>
                </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 flex flex-col items-center justify-center gap-3 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] text-center max-w-[180px]">
                    Перейдіть до розділу &quot;Відгуки&quot;, щоб промодерувати нові коментарі
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
