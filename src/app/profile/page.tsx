import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions/auth";
import { LogOut, Gift } from "lucide-react";
import { redirect } from "next/navigation";
import ProfileSettings from "@/components/ProfileSettings";
import OrderHistory from "@/components/OrderHistory";

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
          <OrderHistory initialOrders={orders || []} userId={user.id} />
        </div>

      </div>
    </div>
  );
}
