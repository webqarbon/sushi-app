import { createClient } from "@/utils/supabase/server";
import AdminCategoryList from "@/components/admin/AdminCategoryList";

export default async function AdminCategoriesPage() {
  const supabase = await createClient(true);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div className="max-w-[1200px] mx-auto">
      <AdminCategoryList initialCategories={categories || []} />
    </div>
  );
}
