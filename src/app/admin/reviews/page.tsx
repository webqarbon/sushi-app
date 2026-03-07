import { createClient } from "@supabase/supabase-js";
import AdminReviewList from "@/components/admin/AdminReviewList";
import { Review } from "@/types/database";

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminReviewsPage() {
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("*, products(name), profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[1200px] mx-auto">
      <AdminReviewList initialReviews={(reviews as Review[]) || []} />
    </div>
  );
}
