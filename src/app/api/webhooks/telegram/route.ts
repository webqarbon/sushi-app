import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

      if (data.startsWith("confirm_") || data.startsWith("cancel_")) {
        const action = data.startsWith("confirm_") ? "confirm" : "cancel";
        const orderId = data.replace(`${action}_`, "");

        // Find Order
        const { data: order, error: fetchError } = await supabaseAdmin
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (fetchError || !order) {
          await answerCallbackQuery(callbackQueryId, "Помилка: замовлення не знайдено");
          return NextResponse.json({ ok: true });
        }

        if (action === "confirm") {
          // Update order status
          const { error: updateError } = await supabaseAdmin
            .from("orders")
            .update({ payment_status: "paid" })
            .eq("id", orderId);

          if (updateError) throw updateError;

          // Update message in Telegram
          await editTelegramMessage(chatId, messageId, `✅ *Замовлення ПІДТВЕРДЖЕНО*\n\nID: \`${orderId}\`\nКлієнт: ${order.delivery_data.name}\nСума: ${order.total_price} ₴\nСтатус: ОПЛАЧЕНО`);
          await answerCallbackQuery(callbackQueryId, "Замовлення підтверджено!");
        } else {
          // Cancel flow
          await editTelegramMessage(chatId, messageId, `❌ *Замовлення СКАСОВАНО*\n\nID: \`${orderId}\``);
          await answerCallbackQuery(callbackQueryId, "Замовлення скасовано");
        }
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
