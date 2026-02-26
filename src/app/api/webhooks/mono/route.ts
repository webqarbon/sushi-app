import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const payload = data.data || data; // Handle both flat and nested formats
    console.log("Processing Monobank Payload:", JSON.stringify(payload, null, 2));

    // Only accept status 'success'
    if (payload.status !== "success") {
      console.log("Monobank: Status is not success:", payload.status);
      return NextResponse.json({ received: true });
    }

    const orderId = payload.reference;
    console.log("Processing Order ID:", orderId);

    // Fetch Order
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      console.error("Monobank Webhook: Order not found:", orderId, fetchError);
      return NextResponse.json({ received: true });
    }

    if (order.payment_status === "paid") {
      console.log("Monobank Webhook: Order already paid:", orderId);
      return NextResponse.json({ received: true });
    }

    // Calculate Bonuses Earned
    const items = order.items_json || [];
    const earnedBonuses = items.reduce((acc: number, item: any) => {
      const price = item.product?.price || 0;
      const bonusPercent = item.product?.bonus_percent || 0;
      const bonus = (price * bonusPercent) / 100;
      return acc + (bonus * (item.quantity || 1));
    }, 0);

    // Update order status securely
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", orderId);

    if (updateError) {
      console.error("Monobank Webhook: Failed to update order:", updateError);
      throw updateError;
    }

    console.log("Monobank Webhook: Order marked as paid:", orderId);

    // Give bonuses if linked to known user
    if (order.user_id) {
       // 1. Confirm Frozen Bonuses
       if (order.bonuses_used > 0) {
         await supabaseAdmin.rpc('confirm_bonuses', {
           user_id_val: order.user_id,
           amount_val: order.bonuses_used
         });
         console.log(`Confirmed ${order.bonuses_used} frozen bonuses for user ${order.user_id}`);
       }

       // 2. Add New Earned Bonuses
       const { data: profile } = await supabaseAdmin
         .from("profiles")
         .select("bonus_balance")
         .eq("id", order.user_id)
         .single();

       if (profile) {
         await supabaseAdmin
           .from("profiles")
           .update({ bonus_balance: Number(profile.bonus_balance) + earnedBonuses })
           .eq("id", order.user_id);
         console.log(`Added ${earnedBonuses} bonuses to user ${order.user_id}`);
       }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mono Webhook Error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
