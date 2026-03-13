'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/utils/auth";

export async function uploadProductImage(formData: FormData) {
  try {
    const adminCheck = await requireAdmin();
    if ("error" in adminCheck) {
      console.error('Admin check failed for upload:', adminCheck.error);
      throw new Error(adminCheck.error);
    }

    const file = formData.get('file') as File;
    if (!file) throw new Error("Файл не знайдено");

    // Use a direct client for Service Role to ensure complete RLS bypass for storage
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log(`[STORAGE] Uploading: ${fileName}, size: ${file.size} bytes`);

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // Pass explicit content type
      });

    if (error) {
      console.error('[STORAGE] Upload error:', error);
      throw new Error(error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log(`[STORAGE] Success: ${publicUrl}`);
    return publicUrl;
  } catch (err: any) {
    console.error('Critical upload error:', err);
    throw new Error(err.message || 'Помилка при завантаженні файлу');
  }
}

export async function createProduct(formData: FormData) {
  try {
    const admin = await requireAdmin();
    if ("error" in admin) throw new Error(admin.error);

    const supabase = await createClient(true);
    
    const name = formData.get('name') as string;
    const priceRaw = formData.get('price') as string;
    const category_id = formData.get('category_id') as string;

    if (!name || !priceRaw || !category_id) {
      throw new Error("Назва, ціна та категорія є обов'язковими полями");
    }

    const price = parseFloat(priceRaw);
    if (isNaN(price)) throw new Error("Некоректна ціна");

    const cost_price = parseFloat(formData.get('cost_price') as string) || 0;
    const bonus_percent = parseFloat(formData.get('bonus_percent') as string) || 5;
    const image_url = formData.get('image_url') as string;
    const description = formData.get('description') as string;

    const { error } = await supabase
      .from('products')
      .insert({ 
        name, 
        price, 
        cost_price, 
        bonus_percent, 
        image_url, 
        description, 
        category_id 
      });

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(error.message);
    }

    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: any) {
    console.error('Create product error:', err);
    throw new Error(err.message || "Помилка при створенні товару");
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const admin = await requireAdmin();
    if ("error" in admin) throw new Error(admin.error);

    const supabase = await createClient(true);
    
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const priceRaw = formData.get('price') as string;
    const category_id = formData.get('category_id') as string;

    if (!id || !name || !priceRaw || !category_id) {
      throw new Error("ID, назва, ціна та категорія є обов'язковими полями");
    }

    const price = parseFloat(priceRaw);
    if (isNaN(price)) throw new Error("Некоректна ціна");

    const cost_price = parseFloat(formData.get('cost_price') as string) || 0;
    const bonus_percent = parseFloat(formData.get('bonus_percent') as string) || 5;
    const image_url = formData.get('image_url') as string;
    const description = formData.get('description') as string;

    const { error } = await supabase
      .from('products')
      .update({ 
        name, 
        price, 
        cost_price, 
        bonus_percent, 
        image_url, 
        description, 
        category_id 
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(error.message);
    }

    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: any) {
    console.error('Update product error:', err);
    throw new Error(err.message || "Помилка при оновленні товару");
  }
}

export async function deleteProduct(id: string) {
  const admin = await requireAdmin();
  if ("error" in admin) throw new Error(admin.error);

  const supabase = await createClient(true);
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/admin/products');
  return { success: true };
}
