'use server';

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Direct admin client (same approach as checkout route - proven to work)
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitReview(productId: string, rating: number, comment: string) {
  // 1. Get authenticated user via standard client (with cookies)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Ви повинні увійти, щоб залишити відгук" };
  }

  // 2. Insert review via admin client (bypasses RLS)
  const { data: insertedReview, error } = await supabaseAdmin.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating,
    comment,
    status: 'pending'
  }).select('id').single();

  if (error) {
    console.error("Review insert error:", error);
    return { success: false, error: error.message };
  }

  const reviewId = insertedReview?.id;

  // 3. Notify Admin via Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminId = process.env.ADMIN_TELEGRAM_ID;

  if (botToken && adminId) {
    const { data: product } = await supabaseAdmin.from('products').select('name').eq('id', productId).single();
    
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
                      { text: "✅ Схвалити", callback_data: `approve_review_${reviewId}` },
                      { text: "❌ Відхилити", callback_data: `reject_review_${reviewId}` }
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
    const { data: review } = await supabaseAdmin.from('reviews').select('product_id').eq('id', reviewId).single();
    
    const { error } = await supabaseAdmin.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    if (error) throw new Error(error.message);

    if (review?.product_id) {
        await recalculateProductRating(review.product_id);
    }
    
    revalidatePath('/');
    revalidatePath('/admin/reviews');
}

export async function rejectReview(reviewId: string) {
    const { data: review } = await supabaseAdmin.from('reviews').select('product_id').eq('id', reviewId).single();
    
    const { error } = await supabaseAdmin.from('reviews').update({ status: 'rejected' }).eq('id', reviewId);
    if (error) throw new Error(error.message);

    if (review?.product_id) {
        await recalculateProductRating(review.product_id);
    }
    
    revalidatePath('/');
    revalidatePath('/admin/reviews');
}

async function recalculateProductRating(productId: string) {
    const { data: approvedReviews } = await supabaseAdmin
        .from('reviews')
        .select('rating')
        .eq('product_id', productId)
        .eq('status', 'approved');

    if (!approvedReviews) return;

    const count = approvedReviews.length;
    const avg = count > 0 
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / count 
        : 0;

    await supabaseAdmin
        .from('products')
        .update({ 
            average_rating: parseFloat(avg.toFixed(1)),
            reviews_count: count 
        })
        .eq('id', productId);
}
