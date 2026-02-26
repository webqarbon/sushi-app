import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify it's from Telegram
    if (!body.callback_query) return NextResponse.json({ received: true });

    const callbackQuery = body.callback_query;
    const chatID = callbackQuery.message.chat.id.toString();
    const data = callbackQuery.data; // e.g. "confirm_uuid" or "cancel_uuid"

    // Validate request originates from allowed Admin
    if (chatID !== process.env.ADMIN_TELEGRAM_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
    
    // Parse Action
    if (data.startsWith("confirm_")) {
      const orderId = data.replace("confirm_", "");

      // 1. Fetch Order
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!order) return NextResponse.json({ received: true });
      if (order.payment_status === "paid") {
         // Already paid
         await notifyAdmin(BOT_TOKEN, callbackQuery.id, "Замовлення вже підтверджено!");
         return NextResponse.json({ received: true });
      }

      // 2. Calculate Bonuses Earned
      const earnedBonuses = order.items_json.reduce((acc: number, item: { product: { price: number; bonus_percent: number }; quantity: number }) => {
        const bonus = (item.product.price * item.product.bonus_percent) / 100;
        return acc + (bonus * item.quantity);
      }, 0);

      // 3. Update Order
      await supabaseAdmin
        .from("orders")
        .update({ payment_status: "paid" })
        .eq("id", orderId);

      // 4. Update Profile Bonuses
      if (order.user_id) {
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
         }
      }

      // 5. Answer Callback Query
      await notifyAdmin(BOT_TOKEN, callbackQuery.id, `✅ Оплата замовлення ${orderId.slice(0,8)} підтверджена!`);
      // Optionally edit the original message to remove buttons
      await editMessageText(BOT_TOKEN, chatID, callbackQuery.message.message_id, `✅ *ОПЛАЧЕНО*\n\n` + callbackQuery.message.text);

    } else if (data.startsWith("cancel_")) {
       const orderId = data.replace("cancel_", "");
       await notifyAdmin(BOT_TOKEN, callbackQuery.id, `❌ Замовлення ${orderId.slice(0,8)} скасовано.`);
       await editMessageText(BOT_TOKEN, chatID, callbackQuery.message.message_id, `❌ *СКАСОВАНО*\n\n` + callbackQuery.message.text);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("TG Webhook Error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

async function notifyAdmin(token: string, callbackId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId, text })
  });
}

async function editMessageText(token: string, chat_id: string, message_id: number, text: string) {
   await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, message_id, text, parse_mode: "Markdown" })
  });
}
