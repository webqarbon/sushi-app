import { createClient } from "@supabase/supabase-js";
import AdminCategoryList from "@/components/admin/AdminCategoryList";

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminCategoriesPage() {
  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div className="max-w-[1200px] mx-auto">
      <AdminCategoryList initialCategories={categories || []} />
    </div>
  );
}
