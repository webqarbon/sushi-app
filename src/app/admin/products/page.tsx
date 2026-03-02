import { createClient } from "@/utils/supabase/server";
import AdminProductList from "@/components/admin/AdminProductList";
import { Product, Category } from "@/types/database";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("order_index", { ascending: true }),
    supabase.from("products").select("*, categories(name)").order("name", { ascending: true }),
  ]);

  return (
    <div className="max-w-[1600px] mx-auto">
      <AdminProductList 
        products={(products as Product[]) || []} 
        categories={(categories as Category[]) || []} 
      />
    </div>
  );
}
