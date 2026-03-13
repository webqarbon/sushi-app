'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/utils/auth";

export async function uploadProductImage(file: File) {
  try {
    const admin = await requireAdmin();
    if ("error" in admin) throw new Error(admin.error);

    const supabase = await createClient(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log(`Uploading file: ${fileName}, size: ${file.size} bytes`);

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw new Error(error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err: any) {
    console.error('Critical upload error:', err);
    throw new Error(err.message || 'Помилка при завантаженні файлу');
  }
}

export async function createProduct(formData: FormData) {
  const admin = await requireAdmin();
  if ("error" in admin) throw new Error(admin.error);

  const supabase = await createClient(true);
  
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const cost_price = parseFloat(formData.get('cost_price') as string) || 0;
  const bonus_percent = parseFloat(formData.get('bonus_percent') as string) || 5;
  const image_url = formData.get('image_url') as string;
  const description = formData.get('description') as string;
  const category_id = formData.get('category_id') as string;

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

  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/products');
  return { success: true };
}

export async function updateProduct(formData: FormData) {
  const admin = await requireAdmin();
  if ("error" in admin) throw new Error(admin.error);

  const supabase = await createClient(true);
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const cost_price = parseFloat(formData.get('cost_price') as string) || 0;
  const bonus_percent = parseFloat(formData.get('bonus_percent') as string) || 5;
  const image_url = formData.get('image_url') as string;
  const description = formData.get('description') as string;
  const category_id = formData.get('category_id') as string;

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
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/admin/products');
  return { success: true };
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
