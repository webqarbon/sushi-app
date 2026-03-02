'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string, slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').insert({ name, slug });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
}

export async function updateCategory(id: string, name: string, slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').update({ name, slug }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
}
