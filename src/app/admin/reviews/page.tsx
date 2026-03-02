import { createClient } from "@/utils/supabase/server";
import AdminReviewList from "@/components/admin/AdminReviewList";
import { Review } from "@/types/database";

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, products(name), profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[1200px] mx-auto">
      <AdminReviewList initialReviews={(reviews as Review[]) || []} />
    </div>
  );
}
