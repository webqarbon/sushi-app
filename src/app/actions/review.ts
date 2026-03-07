'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, rating: number, comment: string) {
  // 1. First get user from standard client (with cookies/session)
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) throw new Error("Ви повинні увійти, щоб залишити відгук");

  // 2. Then use service role for DB operations (bypasses RLS)
  const supabase = await createClient(true);

  const { data: insertedReview, error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating,
    comment,
    status: 'pending' 
  }).select('id').single();

  if (error) throw new Error(error.message);
  const reviewId = insertedReview?.id;

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
    const supabase = await createClient(true);
    
    // 1. Get the review info first
    const { data: review } = await supabase.from('reviews').select('product_id').eq('id', reviewId).single();
    
    // 2. Update status
    const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    if (error) throw new Error(error.message);

    // 3. Recalculate rating for that product
    if (review?.product_id) {
        await recalculateProductRating(review.product_id);
    }
    
    revalidatePath('/');
    revalidatePath('/admin/reviews');
}

export async function rejectReview(reviewId: string) {
    const supabase = await createClient(true);
    
    // 1. Get the review info first
    const { data: review } = await supabase.from('reviews').select('product_id').eq('id', reviewId).single();
    
    // 2. Update status
    const { error } = await supabase.from('reviews').update({ status: 'rejected' }).eq('id', reviewId);
    if (error) throw new Error(error.message);

    // 3. Recalculate rating (in case it was previously approved)
    if (review?.product_id) {
        await recalculateProductRating(review.product_id);
    }
    
    revalidatePath('/');
    revalidatePath('/admin/reviews');
}

async function recalculateProductRating(productId: string) {
    const supabase = await createClient(true); // Required to update products table
    
    // Get all approved reviews for this product
    const { data: approvedReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId)
        .eq('status', 'approved');

    if (!approvedReviews) return;

    const count = approvedReviews.length;
    const avg = count > 0 
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / count 
        : 0;

    // Update the product table
    await supabase
        .from('products')
        .update({ 
            average_rating: parseFloat(avg.toFixed(1)),
            reviews_count: count 
        })
        .eq('id', productId);
}
