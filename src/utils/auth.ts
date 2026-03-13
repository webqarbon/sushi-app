import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export async function requireAdmin(): Promise<{ user: User } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Потрібна авторизація" };
  }

  if (user.user_metadata?.role !== "admin") {
    return { error: "Доступ заборонено" };
  }

  return { user };
}
