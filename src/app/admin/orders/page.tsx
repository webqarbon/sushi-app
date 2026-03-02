import { createClient } from "@/utils/supabase/server";
import { ShoppingBag, Search, Filter, Calendar, Clock, MapPin, Phone, User, CheckCircle, XCircle } from "lucide-react";

export default async function AdminOrders() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  const today = new Date().toLocaleDateString('uk-UA');
  const todayOrders = orders?.filter(o => new Date(o.created_at).toLocaleDateString('uk-UA') === today).length || 0;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Orders</h1>
          <p className="text-slate-500 font-medium tracking-tight">View and manage customer orders ({todayOrders} today).</p>
        </div>
        <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl border border-slate-200 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                <Calendar className="w-4 h-4 text-orange-500" />
                This Week
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-105 transition-all duration-300 active:scale-95">
                <Filter className="w-4 h-4 text-orange-500" />
                Filters
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-slate-50 bg-slate-50/30">
                <th className="px-10 py-6">Order ID</th>
                <th className="px-10 py-6">Customer</th>
                <th className="px-10 py-6">Total</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                            <ShoppingBag className="w-5 h-5 group-hover:text-orange-500" />
                        </div>
                        <div className="font-black text-slate-900 text-base">#{order.id.slice(0, 8)}</div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="space-y-1">
                        <div className="font-black text-slate-900 text-base">{order.profiles?.full_name || "Гість"}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString('uk-UA')} | {new Date(order.created_at).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="font-black text-slate-900 text-lg tracking-tight">₴ {order.total_price}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {JSON.parse(JSON.stringify(order.items || [])).length} items
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'completed' ? 'bg-green-100 text-green-600' : 
                        order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                        'bg-red-100 text-red-600'
                    }`}>
                        {order.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> : order.status === 'pending' ? <Clock className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {order.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="bg-slate-50 text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-95 shadow-sm">
                        View Details
                    </button>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Замовлень поки немає
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

