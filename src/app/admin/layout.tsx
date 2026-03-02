"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, LayoutGrid, Package, LayoutDashboard, Settings, LogOut, Star } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "DASHBOARD", icon: LayoutDashboard },
    { href: "/admin/products", label: "PRODUCTS", icon: Package },
    { href: "/admin/categories", label: "CATEGORIES", icon: LayoutGrid },
    { href: "/admin/reviews", label: "REVIEWS", icon: Star },
    { href: "/admin/orders", label: "ORDERS", icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-screen bg-[#F3F5F9] font-sans">
      {/* Sidebar */}
      <aside className="w-[300px] bg-[#1A1C1E] text-white hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl z-40">
        <div className="p-10">
          <Link href="/" className="flex items-center gap-3 group">
             <div className="relative">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-white/10">
                    <div className="w-5 h-5 bg-orange-500 rounded-full animate-pulse" />
                 </div>
                 <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-lg flex items-center justify-center border-4 border-[#1A1C1E]">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                 </div>
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none">FROZEN</span>
                <span className="text-[9px] font-black tracking-[0.4em] uppercase opacity-40 ml-1">Market Admin</span>
             </div>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-4">
          <div className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-8 ml-4">Main Menu</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all duration-500 group relative ${
                  isActive 
                    ? "bg-orange-500 text-white shadow-2xl shadow-orange-500/40 translate-x-3 scale-105" 
                    : "text-white/40 hover:text-white hover:bg-white/5 hover:translate-x-2"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span className="font-black text-xs tracking-widest">{item.label}</span>
                {isActive && (
                    <div className="absolute -left-6 w-2 h-8 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 space-y-4">
            <button className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all w-full group">
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                <span className="font-bold uppercase tracking-widest text-[10px]">Settings</span>
            </button>
            <button className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all w-full group overflow-hidden relative">
                <LogOut className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                <span className="font-bold uppercase tracking-widest text-[10px]">Log Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -z-10" />
        <div className="p-4 lg:p-12 relative z-10">
            {children}
        </div>
      </main>
    </div>
  );
}
