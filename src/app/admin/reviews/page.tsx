import { createClient } from "@/utils/supabase/server";
import AdminReviewList from "../../../components/admin/AdminReviewList";

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, products(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-[#1A1C1E]">REVIEWS</h1>
          <p className="text-gray-500 font-medium">Pending: {reviews?.filter(r => r.status === 'pending').length || 0} | Total: {reviews?.length || 0}</p>
        </div>
      </div>

      <AdminReviewList initialReviews={reviews || []} />
    </div>
  );
}
