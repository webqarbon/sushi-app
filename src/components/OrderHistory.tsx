"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { History } from "lucide-react";

interface Order {
  id: string;
  payment_status: string;
  created_at: string;
  total_price: number;
  bonuses_used: number;
  items_json: any[];
}

interface OrderHistoryProps {
  initialOrders: Order[];
  userId: string;
}

export default function OrderHistory({ initialOrders, userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const supabase = createClient();

  useEffect(() => {
    // 1. Subscribe to real-time changes for this user's orders
    const channel = supabase
      .channel('realtime:orders')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setOrders((current) => [payload.new as Order, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((current) => 
              current.map((order) => 
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((current) => current.filter((order) => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <History className="w-5 h-5 text-gray-400" />
        Історія замовлень
      </h2>

      {(!orders || orders.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
           <History className="w-16 h-16 text-gray-200 mb-4" />
           <p className="font-medium">Ви ще не зробили жодного замовлення.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="font-bold text-gray-900">Замовлення #{order.id.split('-')[0]}</span>
                   <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                     order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                     order.payment_status === 'awaiting_check' ? 'bg-amber-100 text-amber-700' : 
                     order.payment_status === 'pending' ? 'bg-blue-100 text-blue-700' :
                     'bg-red-100 text-red-700'
                   }`}>
                      {order.payment_status === 'paid' ? 'Оплачено' : 
                       order.payment_status === 'awaiting_check' ? 'Очікує перевірки' : 
                       order.payment_status === 'pending' ? 'Очікує оплати' :
                       'Помилка'}
                    </span>
                </div>
                <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
                  <span>{new Date(order.created_at).toLocaleDateString('uk-UA')}</span>
                  <span>•</span>
                  <span>{order.items_json.length} позицій</span>
                </div>
              </div>
              <div className="text-right">
                 <span className="block text-xl font-black text-gray-900">{order.total_price} ₴</span>
                 {order.bonuses_used > 0 && <span className="block text-xs font-bold text-blue-600">-{order.bonuses_used} бонусів</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
