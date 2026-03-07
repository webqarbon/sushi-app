"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Clock, CheckCircle, XCircle, Search, Filter, Calendar, Truck, ChefHat, Package } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { Order } from "@/types/database";
import { SITE_CONFIG } from "@/constants/site";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: "Очікує",       color: "bg-orange-100 text-orange-600",  icon: Clock },
  confirmed: { label: "Підтверджено", color: "bg-blue-100 text-blue-600",      icon: CheckCircle },
  cooking:   { label: "Готується",    color: "bg-purple-100 text-purple-600",  icon: ChefHat },
  delivery:  { label: "Доставка",     color: "bg-sky-100 text-sky-600",        icon: Truck },
  delivered: { label: "Доставлено",   color: "bg-green-100 text-green-600",    icon: Package },
  cancelled: { label: "Скасовано",    color: "bg-red-100 text-red-600",        icon: XCircle },
};

const STATUS_ORDER = ["pending", "confirmed", "cooking", "delivery", "delivered", "cancelled"];

export default function AdminOrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const supabase = createClient();

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        // Refetch on any change
        supabase
          .from("orders")
          .select("*, profiles(full_name, phone)")
          .order("created_at", { ascending: false })
          .then(({ data }) => { if (data) setOrders(data as Order[]); });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast.error("Помилка оновлення статусу");
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o));
      toast.success(`Статус змінено: ${STATUS_CONFIG[newStatus]?.label}`);
    }
  };

  const today = new Date().toLocaleDateString("uk-UA");
  const todayCount = orders.filter(o => new Date(o.created_at).toLocaleDateString("uk-UA") === today).length;

  const filtered = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.profiles?.full_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Замовлення</h1>
          <p className="text-slate-500 font-medium tracking-tight">
            Всього: <span className="text-slate-900 font-black">{orders.length}</span> &nbsp;|&nbsp; 
            Сьогодні: <span className="text-orange-500 font-black">{todayCount}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative group flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Пошук за ID або ім'ям клієнта..."
            className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-sm shadow-inner"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl overflow-x-auto">
          {["all", ...STATUS_ORDER].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${
                filterStatus === s ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
              }`}
            >
              {s === "all" ? "Всі" : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-slate-50 bg-slate-50/30">
                <th className="px-8 py-6">Замовлення</th>
                <th className="px-8 py-6">Клієнт</th>
                <th className="px-8 py-6">Сума / Товари</th>
                <th className="px-8 py-6">Статус</th>
                <th className="px-8 py-6 text-right">Змінити статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                const itemsCount = Array.isArray(order.items) ? order.items.length : 0;

                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors shrink-0">
                          <ShoppingBag className="w-5 h-5 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</div>
                          <div className="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {new Date(order.created_at).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-black text-slate-900">{order.profiles?.full_name || "Гість"}</div>
                      {order.profiles?.phone && (
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">{order.profiles.phone}</div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-black text-slate-900 text-lg">{SITE_CONFIG.currency}{order.total_price}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{itemsCount} поз.</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer appearance-none text-center"
                      >
                        {STATUS_ORDER.map(s => (
                          <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Замовлень не знайдено</p>
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
