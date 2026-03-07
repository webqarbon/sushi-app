import { createClient } from "@supabase/supabase-js";
import AdminProductList from "@/components/admin/AdminProductList";
import { Product, Category } from "@/types/database";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminProductsPage() {
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabaseAdmin.from("categories").select("*").order("order_index", { ascending: true }),
    supabaseAdmin.from("products").select("*, categories(name)").order("name", { ascending: true }),
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
