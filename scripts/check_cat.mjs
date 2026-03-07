import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategory(catId) {
  const { data: products, error } = await supabase
    .from('products')
    .select('name')
    .eq('category_id', catId);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`--- Products in category ${catId} ---`);
  products.forEach(p => console.log(p.name));
}

checkCategory('0acd0eb6-17e7-47fd-a14f-c0b32dcb9f9d'); // Рослинне молоко
