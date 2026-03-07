import { createClient } from "@supabase/supabase-js";
import AdminOrderList from "@/components/admin/AdminOrderList";
import { Order } from "@/types/database";

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminOrdersPage() {
  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("*, profiles(full_name, phone)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[1400px] mx-auto">
      <AdminOrderList initialOrders={(orders as Order[]) || []} />
    </div>
  );
}
