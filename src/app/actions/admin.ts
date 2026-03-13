"use server";

import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getDashboardStats() {
  const supabaseAdmin = getAdminClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [{ count: productCount }, { count: categoryCount }, { count: reviewCount }, { data: allOrders }] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('created_at, total_price').gte('created_at', thirtyDaysAgo.toISOString()).order('created_at', { ascending: true })
  ]);

  return {
    productCount: productCount || 0,
    categoryCount: categoryCount || 0,
    reviewCount: reviewCount || 0,
    allOrders: allOrders || []
  };
}
