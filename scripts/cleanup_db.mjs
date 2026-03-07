import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const categoriesToDelete = [
  '9f14c70e-57c9-4a4c-858a-d3e286b9d9ce', // Косметика
  'd3e2a8af-4980-4405-99a0-aad27772dec9', // ТЕХНІКА
  'fc6a9338-3821-4ba5-b9a4-7fa1919aca98', // Ножі кухонні
  '776b7f88-b36a-4379-be09-e666eaebb63b', // Одноразовий посуд
  'f0295d35-994b-4df6-b5b0-a4aab22a7d48', // Подарункові пакети
  '8c08c0ab-fdd6-4c08-87a9-a5798d3ed645'  // Посуд для суші
];

async function cleanup() {
  console.log('--- Cleaning up the database ---');

  // Delete miscategorized products
  console.log('Removing miscategorized products (like Irrigators)...');
  const { data: removedProducts, error: prodError } = await supabase
    .from('products')
    .delete()
    .or('name.ilike.%Іригатор%,name.ilike.%Irrigator%,name.ilike.%İrigator%')
    .select('name');

  if (prodError) {
    console.error('Error deleting products:', prodError.message);
  } else {
    console.log(`Deleted ${removedProducts?.length || 0} miscategorized products.`);
    removedProducts?.forEach(p => console.log(`  Deleted: ${p.name}`));
  }

  // Delete unwanted categories
  console.log('Removing unwanted categories (and their products via cascade)...');
  const { data: removedCats, error: catError } = await supabase
    .from('categories')
    .delete()
    .in('id', categoriesToDelete)
    .select('name');

  if (catError) {
    console.error('Error deleting categories:', catError.message);
  } else {
    console.log(`Deleted ${removedCats?.length || 0} categories.`);
    removedCats?.forEach(c => console.log(`  Deleted category: ${c.name}`));
  }

  console.log('Cleanup completed.');
}

cleanup();
