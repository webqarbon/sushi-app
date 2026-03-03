const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addCostPriceColumn() {
  console.log('Adding cost_price column to products table...');

  const sql = `
    ALTER TABLE IF EXISTS public.products 
    ADD COLUMN IF NOT EXISTS cost_price NUMERIC DEFAULT 0;
  `;

  // We try to run it via rpc or just skip if fail
  const { error } = await supabase.rpc('admin_run_query', { query: sql });
  
  if (error) {
    console.warn('RPC admin_run_query not found or failed. Please manually run:');
    console.log(sql);
  } else {
    console.log('Column cost_price added successfully!');
  }
}

addCostPriceColumn();
