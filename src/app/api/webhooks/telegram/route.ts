import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Handle Callback Query (Buttons)
    if (body.callback_query) {
      const { id: callbackQueryId, data, message } = body.callback_query;
      const chatId = message.chat.id;
      const messageId = message.message_id;

      console.log(`Telegram Webhook: Received callback ${data} from chat ${chatId}`);

      if (data.startsWith("confirm_") || data.startsWith("cancel_")) {
        const action = data.startsWith("confirm_") ? "confirm" : "cancel";
        const orderId = data.replace(`${action}_`, "").trim();

        console.log(`Telegram Webhook: Action=${action}, OrderID=${orderId}`);

        // Find Order
        const { data: order, error: fetchError } = await supabaseAdmin
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (fetchError || !order) {
          console.error("Telegram Webhook: Order not found or fetch error:", fetchError);
          await answerCallbackQuery(callbackQueryId, "Помилка: замовлення не знайдено");
          return NextResponse.json({ ok: true });
        }

        console.log("Telegram Webhook: Order found:", order.id);

        if (action === "confirm") {
          // Update order status
          const { error: updateError } = await supabaseAdmin
            .from("orders")
            .update({ payment_status: "paid" })
            .eq("id", orderId);

          if (updateError) {
            console.error("Telegram Webhook: Update error:", updateError);
            throw updateError;
          }

          console.log("Telegram Webhook: Order updated to paid");

          // Finalize bonuses:
          
          // 1. Confirm Frozen (Spent) Bonuses
          if (order.user_id && order.bonuses_used > 0) {
            await supabaseAdmin.rpc('confirm_bonuses', {
              user_id_val: order.user_id,
              amount_val: order.bonuses_used
            });
            console.log(`Confirmed ${order.bonuses_used} bonuses for user ${order.user_id}`);
          }

          // 2. Add New Earned Bonuses
          if (order.user_id) {
            const items = order.items_json || [];
            const earnedBonuses = items.reduce((acc: number, item: any) => {
              const price = item.product?.price || 0;
              const bonusPercent = item.product?.bonus_percent || 0;
              const bonus = (price * bonusPercent) / 100;
              return acc + (bonus * (item.quantity || 1));
            }, 0);

            if (earnedBonuses > 0) {
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
          }

          // Update message in Telegram
          const clientName = order.delivery_data?.name || "Клієнт";
          const total = order.total_price || 0;

          await editTelegramMessage(chatId, messageId, `✅ *Замовлення ПІДТВЕРДЖЕНО*\n\nID: \`${orderId}\`\nКлієнт: ${clientName}\nСума: ${total} ₴\nСтатус: ОПЛАЧЕНО`);
          await answerCallbackQuery(callbackQueryId, "Замовлення підтверджено!");
        } else {
          // Cancel flow: Return Frozen -> Balance
          console.log("Telegram Webhook: Cancelling order");
          
          if (order.user_id && order.bonuses_used > 0) {
            await supabaseAdmin.rpc('cancel_bonuses', {
              user_id_val: order.user_id,
              amount_val: order.bonuses_used
            });
            console.log(`Returned ${order.bonuses_used} bonuses to user ${order.user_id}`);
          }

          await editTelegramMessage(chatId, messageId, `❌ *Замовлення СКАСОВАНО*\n\nID: \`${orderId}\``);
          await answerCallbackQuery(callbackQueryId, "Замовлення скасовано");
        }
      }

      // Handle Review Actions
      if (data.startsWith("approve_review_") || data.startsWith("reject_review_")) {
        const isApprove = data.startsWith("approve_review_");
        const reviewId = data.replace(isApprove ? "approve_review_" : "reject_review_", "").trim();

        // Find Review
        const { data: review, error: reviewError } = await supabaseAdmin
          .from("reviews")
          .select("*, products(name)")
          .eq("id", reviewId)
          .single();

        if (reviewError || !review) {
          await answerCallbackQuery(callbackQueryId, "Помилка: відгук не знайдено");
          return NextResponse.json({ ok: true });
        }

        const newStatus = isApprove ? "approved" : "rejected";
        const { error: updateError } = await supabaseAdmin
          .from("reviews")
          .update({ status: newStatus })
          .eq("id", reviewId);

        if (updateError) {
          await answerCallbackQuery(callbackQueryId, "Помилка оновлення");
          return NextResponse.json({ ok: true });
        }

        // Recalculate product rating
        const { data: approvedReviews } = await supabaseAdmin
          .from("reviews")
          .select("rating")
          .eq("product_id", review.product_id)
          .eq("status", "approved");

        if (approvedReviews) {
          const count = approvedReviews.length;
          const avg = count > 0
            ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / count
            : 0;
          await supabaseAdmin
            .from("products")
            .update({ average_rating: parseFloat(avg.toFixed(1)), reviews_count: count })
            .eq("id", review.product_id);
        }

        revalidatePath("/");
        revalidatePath("/admin/reviews");

        const productName = review.products?.name || "Товар";
        const statusIcon = isApprove ? "✅" : "❌";
        const statusText = isApprove ? "СХВАЛЕНО" : "ВІДХИЛЕНО";

        await editTelegramMessage(
          chatId,
          messageId,
          `${statusIcon} *Відгук ${statusText}*\n\nТовар: ${productName}\nРейтинг: ${'\u2605'.repeat(review.rating)}${'\u2606'.repeat(5 - review.rating)}\nТекст: _"${review.comment}"_`
        );
        await answerCallbackQuery(
          callbackQueryId,
          isApprove ? "Відгук схвалено!" : "Відгук відхилено"
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Telegram Webhook Error:", err);
    return NextResponse.json({ ok: true }); // Always return OK to Telegram
  }
}

async function answerCallbackQuery(callbackQueryId: string, text: string) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text })
  });
}

async function editTelegramMessage(chatId: number, messageId: number, text: string) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [] } // Remove buttons
    })
  });
}
