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
    <div className="container mx-auto px-4 py-10 lg:px-8 max-w-6xl">
      {/* Breadcrumb / Back Navigation */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2.5 text-gray-400 hover:text-gray-900 font-bold mb-10 transition-all group"
      >
        <div className="p-2.5 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-all border border-gray-100/50">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Назад на головну
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Особистий кабінет</h1>
          <p className="text-lg text-gray-500 font-medium tracking-tight">Вітаємо, {profile?.full_name || user.email}!</p>
        </div>
        <form action={signOut}>
          <button className="flex items-center px-6 py-3 text-red-500 bg-red-50/50 hover:bg-red-50 font-bold rounded-2xl transition-all active:scale-95 border border-red-100/50">
            <LogOut className="w-4 h-4 mr-2.5" />
            Вийти з акаунту
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Loyalty & Settings */}
        <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Bonus Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              
              <div className="flex items-center gap-3 mb-8 bg-white/15 w-fit px-5 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                <Gift className="w-4 h-4" />
                <span className="font-bold text-xs tracking-widest uppercase">Бонусна програма</span>
              </div>
              
              <div className="flex items-end gap-2 mb-2">
                <span className="text-7xl font-black leading-none">{profile?.bonus_balance ?? 0}</span>
                <span className="text-2xl font-black mb-1 opacity-80">₴</span>
              </div>
              
              <div className="text-blue-50 font-medium opacity-90 mb-6">Доступно до списання</div>

              {profile?.frozen_bonuses > 0 && (
                <div className="bg-white/10 rounded-[1.5rem] p-5 border border-white/20 backdrop-blur-md">
                  <div className="text-2xl font-black mb-1">{profile.frozen_bonuses} ₴</div>
                  <div className="text-[10px] text-blue-100 font-black uppercase tracking-widest opacity-80">В обробці (заморожено)</div>
                </div>
              )}
            </div>

            {/* Settings Group */}
            <div className="space-y-6">
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
        <div className="lg:col-span-8">
          <OrderHistory initialOrders={orders || []} userId={user.id} />
        </div>

      </div>
    </div>
  );
}
