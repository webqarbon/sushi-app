import Link from "next/link";
import { ShoppingBag, LayoutGrid, Package, ChevronRight, LayoutDashboard, Settings } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F3F5F9]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1C1E] text-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/" className="flex flex-col items-center">
             <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                   <div className="w-4 h-4 bg-orange-500 rounded-full" />
                </div>
                <div className="flex flex-col">
                   <span className="text-xl font-black tracking-tighter leading-none">FROZEN</span>
                   <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-50 ml-1">Market Admin</span>
                </div>
             </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-bold">DASHBOARD</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
            <Package className="w-5 h-5" />
            <span className="font-bold">PRODUCTS</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <LayoutGrid className="w-5 h-5" />
            <span className="font-bold">CATEGORIES</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-bold">ORDERS</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors text-white/70 hover:text-white w-full">
            <Settings className="w-5 h-5" />
            <span className="font-bold uppercase tracking-wider text-xs">SETTINGS</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
