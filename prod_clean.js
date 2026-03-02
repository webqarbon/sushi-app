const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanAndPrepareProduction() {
    console.log('🚀 CLEANING DATABASE FOR PRODUCTION...');

    // 1. Remove fake columns & Ensure cost_price
    const sqlAlters = `
        ALTER TABLE IF EXISTS public.products 
        DROP COLUMN IF EXISTS fake_rating,
        DROP COLUMN IF EXISTS fake_reviews_count,
        ADD COLUMN IF NOT EXISTS cost_price NUMERIC DEFAULT 0;
    `;

    // 2. Clear all test data
    const sqlTruncate = `
        TRUNCATE TABLE public.reviews, public.orders, public.products, public.categories CASCADE;
    `;

    console.log('Dropping fake columns and adding cost_price...');
    const { error: error1 } = await supabase.rpc('admin_run_query', { query: sqlAlters });
    if (error1) console.warn('Note: SQL Alter may need manual run in Dashboard.');

    console.log('Wiping all test data (truncating)...');
    const { error: error2 } = await supabase.rpc('admin_run_query', { query: sqlTruncate });
    if (error2) console.warn('Note: SQL Truncate may need manual run in Dashboard.');

    console.log('Cleaning finished.');
}

cleanAndPrepareProduction();
