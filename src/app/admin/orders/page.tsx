import { createClient } from "@supabase/supabase-js";
import AdminOrderList from "@/components/admin/AdminOrderList";
import { Order } from "@/types/database";

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default async function AdminOrdersPage() {
  const supabaseAdmin = getAdminClient();

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*, profiles(full_name, phone)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin Orders fetch error:", error);
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <AdminOrderList initialOrders={(orders as Order[]) || []} />
    </div>
  );
}
