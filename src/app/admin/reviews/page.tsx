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
      <AdminReviewList initialReviews={reviews || []} />
    </div>
  );
}
