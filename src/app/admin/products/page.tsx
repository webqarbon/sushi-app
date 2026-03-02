import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import AdminProductList from "@/components/admin/AdminProductList";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true });

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("name", { ascending: true });

  return (
    <div className="p-4 lg:p-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-[#1A1C1E]">PRODUCTS</h1>
          <p className="text-gray-500 font-medium">Manage your product catalog ({products?.length || 0} items found)</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm hidden sm:block">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Last Update</span>
                <span className="text-sm font-black text-[#1A1C1E]">{new Date().toLocaleDateString('uk-UA')}</span>
             </div>
            <button className="bg-orange-500 text-white px-8 py-4 rounded-[2rem] font-black shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all text-sm tracking-tight">
            + CREATE NEW PRODUCT
            </button>
        </div>
      </div>

      <AdminProductList 
        products={products as any || []} 
        categories={categories as any || []} 
      />
    </div>
  );
}
