import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions/auth";
import { LogOut, Gift, History } from "lucide-react";
import { redirect } from "next/navigation";
import ProfileSettings from "@/components/ProfileSettings";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch expanded profile specific data (bonuses)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Особистий кабінет</h1>
          <p className="text-gray-500 font-medium">Вітаємо, {profile?.full_name || user.email}!</p>
        </div>
        <form action={signOut}>
          <button className="flex items-center px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 font-semibold rounded-xl transition-colors">
            <LogOut className="w-4 h-4 mr-2" />
            Вийти
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Stats/Loyalty */}
        <div className="md:col-span-4 flex flex-col gap-8">
            <div className="bg-gradient-to-br from-blue-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
              <div className="flex items-center gap-3 mb-6 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/20">
                <Gift className="w-5 h-5" />
                <span className="font-semibold text-sm tracking-wide uppercase">Ваші Бонуси</span>
              </div>
              <div className="text-5xl font-black mb-1">
                {profile?.bonus_balance ?? 0}
              </div>
              <div className="text-blue-100 font-medium opacity-90">Доступно до списання (₴)</div>
            </div>

            {/* User details settings form */}
            <ProfileSettings 
              initialData={{
                full_name: profile?.full_name || "",
                phone: profile?.phone || "",
              }} 
            />
        </div>

        {/* Right Side: Order history */}
        <div className="md:col-span-8">
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
        </div>

      </div>
    </div>
  );
}
