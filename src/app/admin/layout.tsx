"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, LayoutGrid, Package, LayoutDashboard, Settings, LogOut, Star, User, Bell, Search } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col z-50">
        <div className="p-8">
           <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none text-slate-900">FROZEN <span className="text-orange-500">ADMIN</span></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Tool</span>
              </div>
           </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          <div className="px-4 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Main Menu</span>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-100" : "group-hover:scale-110"}`} />
                <span className="font-bold text-sm">{item.label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
            <Link 
              href="/admin/settings"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
                pathname === "/admin/settings" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                <span className="font-bold text-sm">Settings</span>
            </Link>
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all w-full mt-1 group">
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-all" />
                <span className="font-bold text-sm">Log Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-72 flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-10">
            <div className="relative group w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all text-slate-500">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
                </button>
                <div className="h-10 w-[1px] bg-slate-100" />
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-slate-900 leading-none">Frozen Admin</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super Admin</span>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                        <User className="w-5 h-5 text-slate-500" />
                    </div>
                </div>
            </div>
        </header>

        {/* Content */}
        <main className="p-10">
            {children}
        </main>
      </div>
    </div>
  );
}
