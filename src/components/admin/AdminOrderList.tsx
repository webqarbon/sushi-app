"use client";

import React, { useState } from "react";
import { ShoppingBag, Clock, CheckCircle, XCircle, Search, Truck, ChefHat, Package, ChevronDown, ChevronUp, User, MapPin, CreditCard, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { Order } from "@/types/database";
import { SITE_CONFIG } from "@/constants/site";

function getOrderClientName(o: Order): string {
  return o.delivery_data?.name || o.profiles?.full_name || "Гість";
}

function getOrderPhone(o: Order): string | undefined {
  return o.delivery_data?.phone || o.profiles?.phone;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending:   { label: "Очікує",       color: "bg-orange-100 text-orange-600",  icon: Clock },
  confirmed: { label: "Підтверджено", color: "bg-blue-100 text-blue-600",      icon: CheckCircle },
  cooking:   { label: "Готується",    color: "bg-purple-100 text-purple-600",  icon: ChefHat },
  delivery:  { label: "Доставка",     color: "bg-sky-100 text-sky-600",        icon: Truck },
  delivered: { label: "Доставлено",   color: "bg-green-100 text-green-600",    icon: Package },
  cancelled: { label: "Скасовано",    color: "bg-red-100 text-red-600",        icon: XCircle },
};

const STATUS_ORDER = ["pending", "confirmed", "cooking", "delivery", "delivered", "cancelled"];

export default function AdminOrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast.error("Помилка оновлення статусу");
    } else {
      toast.success(`Статус змінено: ${STATUS_CONFIG[newStatus]?.label}`);
    }
  };

  const today = new Date().toLocaleDateString("uk-UA");
  const todayCount = initialOrders.filter(o => new Date(o.created_at).toLocaleDateString("uk-UA") === today).length;

  const filtered = initialOrders.filter(o => {
    const clientName = getOrderClientName(o);
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      (o.delivery_data?.phone || "").includes(search) ||
      (o.delivery_data?.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.delivery_data?.branch || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Замовлення</h1>
          <p className="text-slate-500 font-medium tracking-tight">
            Всього: <span className="text-slate-900 font-black">{initialOrders.length}</span> &nbsp;|&nbsp; 
            Сьогодні: <span className="text-orange-500 font-black">{todayCount}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-slate-50 bg-slate-50/30">
                <th className="px-6 py-4 w-10" />
                <th className="px-6 py-4">Замовлення</th>
                <th className="px-6 py-4">Клієнт</th>
                <th className="px-6 py-4">Сума / Товари</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4 text-right">Змінити статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                const items = Array.isArray(order.items_json) ? order.items_json : [];
                const itemsCount = items.length;
                const isExpanded = expandedId === order.id;
                const clientName = getOrderClientName(order);
                const phone = getOrderPhone(order);

                return (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td className="px-4 py-4 w-10" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                        <button type="button" className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors shrink-0">
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
                      <td className="px-6 py-4">
                        <div className="font-black text-slate-900">{clientName}</div>
                        {phone && (
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">{phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-slate-900 text-base">{SITE_CONFIG.currency}{order.total_price}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{itemsCount} поз.</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          onClick={e => e.stopPropagation()}
                          className="bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer appearance-none text-center"
                        >
                          {STATUS_ORDER.map(s => (
                            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <User className="w-3.5 h-3.5" /> Клієнт
                              </div>
                              <div className="font-black text-slate-900">{clientName}</div>
                              {phone && <div className="text-slate-500 font-medium">{phone}</div>}
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <MapPin className="w-3.5 h-3.5" /> Доставка
                              </div>
                              <div className="font-medium text-slate-700">
                                {order.delivery_data?.city && <div>Місто: {order.delivery_data.city}</div>}
                                {order.delivery_data?.branch && <div>Відділення НП: {order.delivery_data.branch}</div>}
                                {!order.delivery_data?.city && !order.delivery_data?.branch && <div className="text-slate-400">—</div>}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <CreditCard className="w-3.5 h-3.5" /> Оплата
                              </div>
                              <div className="font-medium text-slate-700">
                                {order.payment_method === "mono" ? "Монобанк" : order.payment_method === "cash" ? "Готівка" : order.payment_method || "—"}
                              </div>
                            </div>
                            <div className="md:col-span-2 lg:col-span-3 space-y-3">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <ShoppingBag className="w-3.5 h-3.5" /> Товари
                              </div>
                              <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2">
                                {items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center">
                                    <span className="font-medium text-slate-700">
                                      {item.product?.name || "Товар"} × {item.quantity}
                                    </span>
                                    <span className="font-black text-slate-900">
                                      {SITE_CONFIG.currency}{(item.product?.price || 0) * item.quantity}
                                    </span>
                                  </div>
                                ))}
                                {order.bonuses_used ? (
                                  <div className="flex justify-between items-center text-orange-500 pt-2 border-t border-slate-100">
                                    <span>Бонуси</span>
                                    <span>-{SITE_CONFIG.currency}{order.bonuses_used}</span>
                                  </div>
                                ) : null}
                                <div className="flex justify-between items-center font-black text-slate-900 pt-2 border-t border-slate-200">
                                  <span>Разом</span>
                                  <span>{SITE_CONFIG.currency}{order.total_price}</span>
                                </div>
                              </div>
                            </div>
                            {order.comment && (
                              <div className="md:col-span-2 lg:col-span-3 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                  <MessageSquare className="w-3.5 h-3.5" /> Коментар
                                </div>
                                <p className="text-slate-600 font-medium italic">{order.comment}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
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
