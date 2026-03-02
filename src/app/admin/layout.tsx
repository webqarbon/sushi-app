"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, LayoutGrid, Package, LayoutDashboard, LogOut, Star, User, Bell, Search, Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
    { href: "/admin/products", label: "Товари", icon: Package },
    { href: "/admin/categories", label: "Категорії", icon: LayoutGrid },
    { href: "/admin/reviews", label: "Відгуки", icon: Star },
    { href: "/admin/orders", label: "Замовлення", icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 scroll-smooth overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-all duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col z-50 transform transition-transform duration-500 ease-soft-spring ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between border-b border-slate-50">
           <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <div className="w-4 h-4 bg-white rounded-full transition-all hover:scale-125" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none text-slate-900 uppercase">Frozen <span className="text-orange-500">Admin</span></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Management Tool</span>
              </div>
           </Link>
           <button 
             onClick={() => setIsSidebarOpen(false)}
             className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors"
           >
             <X className="w-6 h-6" />
           </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          <div className="px-4 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 opacity-40">Головне меню</span>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-500 group relative ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isActive ? 'bg-white/10 border-white/10' : 'bg-slate-50 border-slate-100 group-hover:bg-white group-hover:border-slate-200'}`}>
                    <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? "scale-100 text-orange-400" : "group-hover:scale-110"}`} />
                </div>
                <span className="font-black text-sm uppercase tracking-tighter">{item.label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-50">
            <button className="flex items-center justify-center gap-3 px-6 py-4 rounded-3xl bg-red-50/50 text-red-500 hover:bg-red-500 hover:text-white transition-all w-full group overflow-hidden relative border border-red-100/50">
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-all" />
                <span className="font-black text-xs uppercase tracking-widest">Вийти з кабінету</span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen w-full">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-3 bg-slate-50 rounded-2xl text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden md:flex relative group w-72 lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Шукати що завгодно..." 
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all shadow-inner"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-8">
                <button className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-all text-slate-500 shadow-sm">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-4 border-white" />
                </button>
                <div className="h-10 w-[1px] bg-slate-200" />
                <div className="flex items-center gap-4 group">
                    <div className="flex flex-col items-end mr-1">
                        <span className="text-sm font-black text-slate-900 leading-none uppercase tracking-tighter">Frozen Admin</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                           <div className="w-1 h-1 bg-green-500 rounded-full" /> Super Admin
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner group-hover:border-slate-300 transition-all overflow-hidden relative">
                        <User className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
            </div>
        </header>

        {/* Content */}
        <main className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full mx-auto">
            <div className="relative">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
