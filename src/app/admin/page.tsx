import { LayoutDashboard, Users, ShoppingBag, TrendingUp, Package, Star } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Sales", value: "₴ 128,430", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { label: "Total Orders", value: "1,240", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Products", value: "527", icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Total Reviews", value: "842", icon: Star, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Dashboard</h1>
        <p className="text-slate-500 font-medium tracking-tight">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase mb-8">Recent Activity</h3>
            <div className="space-y-8">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-6 group">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                            <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-black text-slate-900">New Order #8920</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">2 minutes ago</div>
                        </div>
                        <div className="text-sm font-black text-slate-900">₴ 1,240</div>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase mb-8">Top Products</h3>
            <div className="space-y-8">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-6 group">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                            <Package className="w-5 h-5 text-slate-400 group-hover:text-green-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-black text-slate-900">Philadelphia Sushi Roll</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">124 sales this week</div>
                        </div>
                        <div className="text-sm font-black text-green-500">+12%</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
