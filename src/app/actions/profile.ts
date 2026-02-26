"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: { full_name: string; phone: string }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Необхідна авторизація");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: formData.full_name,
      phone: formData.phone,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Помилка оновлення профілю:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/profile");
  return { success: true };
}
