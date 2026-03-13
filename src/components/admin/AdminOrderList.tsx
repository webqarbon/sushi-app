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

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                    <tr className={`group transition-colors ${isExpanded ? 'bg-slate-50/30' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-4 py-4 w-10">
                        <button 
                          onClick={() => setExpandedId(isExpanded ? null : order.id)}
                          type="button" 
                          className={`p-2 rounded-lg transition-all ${isExpanded ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all shrink-0 ${isExpanded ? 'bg-orange-50 border-orange-100 text-orange-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            <ShoppingBag className="w-5 h-5" />
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
                          className="bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer appearance-none text-center min-w-[140px]"
                        >
                          {STATUS_ORDER.map(s => (
                            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <td colSpan={6} className="px-6 py-8 bg-slate-50/80 border-b border-slate-100">
                          <div className="max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                              {/* Client Section */}
                              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group/card transition-all hover:shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50/50 rounded-full blur-2xl -mr-8 -mt-8" />
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                    <User className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Клієнт</span>
                                </div>
                                <div className="space-y-1">
                                  <div className="font-black text-slate-900 text-base">{clientName}</div>
                                  {phone && (
                                    <a href={`tel:${phone}`} className="text-slate-500 font-bold hover:text-orange-500 transition-colors flex items-center gap-2">
                                      {phone}
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Delivery Section */}
                              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group/card transition-all hover:shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-full blur-2xl -mr-8 -mt-8" />
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <MapPin className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Доставка</span>
                                </div>
                                <div className="space-y-2 text-sm font-bold text-slate-700">
                                  {order.delivery_data?.city ? (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Місто</span>
                                      <span>{order.delivery_data.city}</span>
                                    </div>
                                  ) : null}
                                  {order.delivery_data?.branch ? (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">НП / Адреса</span>
                                      <span className="leading-tight">{order.delivery_data.branch}</span>
                                    </div>
                                  ) : (
                                    !order.delivery_data?.city && <div className="text-slate-400 italic">Дані відсутні</div>
                                  )}
                                </div>
                              </div>

                              {/* Payment Section */}
                              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group/card transition-all hover:shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50/50 rounded-full blur-2xl -mr-8 -mt-8" />
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                    <CreditCard className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Оплата</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Метод</span>
                                  <span className="font-bold text-slate-900">
                                    {order.payment_method === "mono" ? "Монобанк" : 
                                     order.payment_method === "cash" ? "Готівка" : 
                                     order.payment_method === "details" ? "Оплата за реквізитами" : 
                                     order.payment_method || "—"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Products Table */}
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                                    <ShoppingBag className="w-4 h-4" />
                                  </div>
                                  <span className="text-xs font-black uppercase tracking-widest text-slate-900">Товари в замовленні</span>
                                </div>
                                <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase tracking-tighter">
                                  {items.length} позицій
                                </span>
                              </div>
                              <div className="p-6 space-y-4">
                                {items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-4 py-1">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shrink-0">
                                      <Package className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-slate-900 truncate">
                                        {item.product?.name || "Товар без назви"}
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        {item.quantity} шт × {SITE_CONFIG.currency}{item.product?.price || 0}
                                      </div>
                                    </div>
                                    <div className="text-right font-black text-slate-900">
                                      {SITE_CONFIG.currency}{(item.product?.price || 0) * item.quantity}
                                    </div>
                                  </div>
                                ))}

                                <div className="pt-6 border-t border-slate-100 space-y-3">
                                  {order.bonuses_used ? (
                                    <div className="flex justify-between items-center text-xs font-bold text-orange-500">
                                      <span className="uppercase tracking-widest opacity-70 italic">Використано бонусів</span>
                                      <span>-{SITE_CONFIG.currency}{order.bonuses_used}</span>
                                    </div>
                                  ) : null}
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-900">Разом до сплати</span>
                                    <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                      {SITE_CONFIG.currency}{order.total_price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {order.comment && (
                              <div className="mt-8 bg-orange-50/50 rounded-2xl p-6 border border-orange-100/50 border-dashed">
                                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-orange-600">
                                  <MessageSquare className="w-3.5 h-3.5" /> Коментар від клієнта
                                </div>
                                <p className="text-slate-700 font-bold leading-relaxed">{order.comment}</p>
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filtered.map(order => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const Icon = cfg.icon;
          const isExpanded = expandedId === order.id;
          const clientName = getOrderClientName(order);
          const phone = getOrderPhone(order);
          const items = Array.isArray(order.items_json) ? order.items_json : [];

          return (
            <div key={order.id} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-orange-500/10' : ''}`}>
              <div 
                className="p-4 flex items-center justify-between"
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isExpanded ? 'bg-orange-50 border-orange-100 text-orange-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-xs uppercase tracking-tighter mb-0.5">#{order.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <div className="font-black text-slate-900 text-sm leading-none">{SITE_CONFIG.currency}{order.total_price}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{items.length} поз.</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Status Bar Mobile */}
              {!isExpanded && (
                <div className="px-4 pb-4 flex items-center justify-between gap-4">
                   <span className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setExpandedId(order.id); }}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest"
                    >
                      Керувати
                    </button>
                </div>
              )}

              {isExpanded && (
                <div className="border-t border-slate-50 bg-slate-50/50 p-4 space-y-6">
                  {/* Status Select Mobile */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Змінити статус</span>
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="w-full bg-white text-slate-900 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-100 shadow-sm"
                    >
                      {STATUS_ORDER.map(s => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Summary Blocks Mobile */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Клієнт</div>
                      <div className="font-black text-slate-900">{clientName}</div>
                      {phone && <a href={`tel:${phone}`} className="text-[10px] text-orange-500 font-bold block mt-1">{phone}</a>}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Доставка</div>
                      <div className="text-xs font-bold text-slate-700">
                        {order.delivery_data?.city && <div>{order.delivery_data.city}</div>}
                        {order.delivery_data?.branch && <div className="mt-1 opacity-70">{order.delivery_data.branch}</div>}
                        {!order.delivery_data?.city && !order.delivery_data?.branch && <div>—</div>}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Оплата</div>
                      <div className="text-xs font-bold text-slate-900">
                        {order.payment_method === "mono" ? "💳 Монобанк" : 
                         order.payment_method === "cash" ? "💵 Готівка" : 
                         "📝 Подробиці"}
                      </div>
                    </div>
                  </div>

                  {/* Items Mobile */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Товари</div>
                    {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700 pr-4">{item.product?.name || "Товар"} × {item.quantity}</span>
                        <span className="text-slate-900 shrink-0">{SITE_CONFIG.currency}{(item.product?.price || 0) * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-sm font-black uppercase tracking-tighter">Разом</span>
                      <span className="text-lg font-black">{SITE_CONFIG.currency}{order.total_price}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Замовлень немає</p>
          </div>
        )}
      </div>
    </div>
  );
}
