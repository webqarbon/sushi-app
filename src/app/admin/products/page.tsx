import { createClient } from "@supabase/supabase-js";
import AdminProductList from "@/components/admin/AdminProductList";
import { Product, Category } from "@/types/database";

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default async function AdminProductsPage() {
  const supabaseAdmin = getAdminClient();

  const [{ data: categories, error: catErr }, { data: products, error: prodErr }] = await Promise.all([
    supabaseAdmin.from("categories").select("*").order("order_index", { ascending: true }),
    supabaseAdmin.from("products").select("*, categories(name)").order("name", { ascending: true }),
  ]);

  if (catErr) console.error("Admin Categories fetch error:", catErr);
  if (prodErr) console.error("Admin Products fetch error:", prodErr);

  return (
    <div className="max-w-[1600px] mx-auto">
      <AdminProductList 
        products={(products as Product[]) || []} 
        categories={(categories as Category[]) || []} 
      />
    </div>
  );
}
