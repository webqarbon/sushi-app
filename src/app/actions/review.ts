'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, rating: number, comment: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Ви повинні увійти, щоб залишити відгук");

  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating,
    comment,
    status: 'pending' // Default to pending
  });

  if (error) throw new Error(error.message);

  // Notify Admin via Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminId = process.env.ADMIN_TELEGRAM_ID;

  if (botToken && adminId) {
    const { data: product } = await supabase.from('products').select('name').eq('id', productId).single();
    
    const message = `🌟 *НОВИЙ ВІДГУК (Frozen Market)*\n\n` +
                    `📦 *Товар:* ${product?.name}\n` +
                    `👤 *Email:* ${user.email}\n` +
                    `⭐ *Рейтинг:* ${'★'.repeat(rating)}${'☆'.repeat(5-rating)}\n` +
                    `💬 *Текст:* _"${comment}"_\n\n` +
                    `🔗 [Перейти в Адмін-панель](${process.env.NEXT_PUBLIC_SITE_URL}/admin/reviews)`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminId,
          text: message,
          parse_mode: 'Markdown',
          reply_markup: {
              inline_keyboard: [
                  [
                      { text: "✅ Схвалити", url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reviews` },
                      { text: "❌ Відхилити", url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reviews` }
                  ]
              ]
          }
        })
      });
    } catch (e) {
      console.error("Telegram notification failed", e);
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function approveReview(reviewId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    if (error) throw new Error(error.message);
    revalidatePath('/');
}

export async function rejectReview(reviewId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('reviews').update({ status: 'rejected' }).eq('id', reviewId);
    if (error) throw new Error(error.message);
    revalidatePath('/');
}
