"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return redirect(`/login?error=${encodeURIComponent("Неправильна пошта або пароль")}`);
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });

  if (error) {
    console.error("SignUp Error:", error);
    return redirect(`/login?error=${encodeURIComponent("Помилка під час реєстрації")}`);
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
