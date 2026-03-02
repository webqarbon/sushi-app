import { createClient } from "@/utils/supabase/server";
import AdminCategoryList from "../../../components/admin/AdminCategoryList";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="p-4 lg:p-12 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-[#1A1C1E]">CATEGORIES</h1>
          <p className="text-gray-500 font-medium">Manage product categories ({categories?.length || 0} total)</p>
        </div>
      </div>

      <AdminCategoryList initialCategories={categories || []} />
    </div>
  );
}
