import { createClient } from "@/utils/supabase/server";
import AdminOrderList from "@/components/admin/AdminOrderList";
import { Order } from "@/types/database";

export default async function AdminOrdersPage() {
  const supabase = await createClient(true);

  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(full_name, phone)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[1400px] mx-auto">
      <AdminOrderList initialOrders={(orders as Order[]) || []} />
    </div>
  );
}
