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
    <div className="space-y-12 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Дашборд</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Основна статистика вашого магазину</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 blur-2xl -z-10 rounded-full" />
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-8 border border-white shadow-sm group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{stat.label}</div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">Останні замовлення</h3>
                <ShoppingBag className="w-6 h-6 text-slate-200" />
            </div>
            <div className="space-y-6 flex-1">
                {recentOrders && recentOrders.length > 0 ? recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center gap-6 p-4 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                            <span className="font-black text-xs text-orange-500">#{order.id.slice(0, 4)}</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{order.profiles?.full_name || "Гість"}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                <Clock className="w-3 h-3 text-slate-300" />
                                {new Date(order.created_at).toLocaleString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        <div className="text-lg font-black text-slate-900 tracking-tighter">{SITE_CONFIG.currency}{order.total_price}</div>
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-40">
                         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="w-10 h-10" />
                         </div>
                         <p className="text-xs font-black uppercase tracking-widest">Замовлень поки немає</p>
                    </div>
                )}
            </div>
        </div>

        {/* Reviews Overview */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">Менеджмент відгуків</h3>
                <Star className="w-6 h-6 text-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 flex flex-col items-center">
                    <span className="text-2xl font-black text-green-600 leading-none">{approvedReviews?.length || 0}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-500 mt-2">Схвалено</span>
                </div>
                <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 flex flex-col items-center animate-pulse">
                    <span className="text-2xl font-black text-orange-600 leading-none text-center flex flex-col items-center">{pendingReviews?.length || 0}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 mt-2">Нові</span>
                </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100/50 flex flex-col items-center justify-center gap-4 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center max-w-[200px]">
                    Перейдіть до розділу &quot;Відгуки&quot;, щоб промодерувати нові коментарі
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
