import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions/auth";
import { LogOut, Gift, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileSettings from "@/components/ProfileSettings";
import OrderHistory from "@/components/OrderHistory";
import ChangePassword from "@/components/ChangePassword";

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
    <div className="container mx-auto px-4 pt-8 pb-24 lg:px-8 max-w-6xl min-h-0">
      {/* Breadcrumb / Back Navigation */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold mb-6 transition-all group text-sm"
      >
        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all border border-gray-100/50">
          <ArrowLeft className="w-3.5 h-3.5" />
        </div>
        Назад на головну
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Особистий кабінет</h1>
          <p className="text-base text-gray-500 font-medium tracking-tight">Вітаємо, {profile?.full_name || user.email}!</p>
        </div>
        <form action={signOut}>
          <button className="flex items-center px-5 py-2.5 text-red-500 bg-red-50/50 hover:bg-red-50 font-bold rounded-xl text-sm transition-all active:scale-95 border border-red-100/50">
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Вийти
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Loyalty & Settings */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:h-[735px]">
            {/* Bonus Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group shrink-0">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              
              <div className="flex items-center gap-2.5 mb-6 bg-white/15 w-fit px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                <Gift className="w-3.5 h-3.5" />
                <span className="font-bold text-[10px] tracking-widest uppercase">Бонусна програма</span>
              </div>
              
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black leading-none">{profile?.bonus_balance ?? 0}</span>
                <span className="text-lg font-black mb-0.5 opacity-80">₴</span>
              </div>
              
              <div className="text-blue-50 text-xs font-black uppercase tracking-[0.15em] opacity-80 mb-6">Доступно до списання</div>

              {profile?.frozen_bonuses > 0 && (
                <div className="mt-4 bg-white/10 rounded-2xl p-3 border border-white/20 backdrop-blur-md">
                  <div className="text-lg font-black mb-0.5">{profile.frozen_bonuses} ₴</div>
                  <div className="text-[8px] text-blue-100 font-black uppercase tracking-widest opacity-80 leading-none">В обробці (заморожено)</div>
                </div>
              )}
            </div>

            {/* Settings Group */}
            <div className="space-y-4 min-h-0 flex-1">
              <ProfileSettings 
                initialData={{
                  full_name: profile?.full_name || "",
                  phone: profile?.phone || "",
                }} 
              />
              <ChangePassword />
            </div>
        </div>

        {/* Right Column: Order history */}
        <div className="lg:col-span-8 lg:h-[735px]">
          <OrderHistory initialOrders={orders || []} userId={user.id} />
        </div>

      </div>
    </div>
  );
}
